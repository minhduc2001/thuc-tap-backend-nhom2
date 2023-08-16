import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as exc from '@base/api/exception.reslover';
import { AudioBook } from './entities/audio-book.entity';
import { BaseService } from '@/base/service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '@/base/logger';
import { PaginateConfig } from '@/base/service/paginate';
import { GenreService } from '@/genre/genre.service';
import { AuthorService } from '@/author/author.service';
import {
  CreateAudioBookDto,
  ListAudioBookDto,
  UpdateAudioBookDto,
} from './audio-book.dto';
import { AudioBookLibrary } from '@/library/entities/audio-book-library.entity';
import { Library } from '@/library/entities/library.entity';
import { User } from '@/user/user.entity';
import { UrlService } from '@/base/helper/url.service';
import { FileService } from '@/base/helper/file.service';

const MAXIMUM_BITRATE_128K = 128 * 10 ** 3; // 128 Kbps
const MAXIMUM_BITRATE_256K = 256 * 10 ** 3; // 256 Kbps
const MAXIMUM_BITRATE_320K = 320 * 10 ** 3; // 320 Kbps

const execPromise = promisify(exec);

@Injectable()
export class AudioBookService extends BaseService<AudioBook> {
  constructor(
    @InjectRepository(AudioBook)
    protected readonly repository: Repository<AudioBook>,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
    private dataSource: DataSource,
    private readonly loggerService: LoggerService,
    private readonly urlService: UrlService,
    private readonly fileService: FileService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(AudioBookService.name);

  async preResponse(audioBooks: AudioBook[], user: User) {
    for (const audioBook of audioBooks) {
      if (
        audioBook.url &&
        (user.role === 'admin' || user.packageId || audioBook.free)
      )
        audioBook.url = this.urlService.dataUrl(audioBook.url);
      else audioBook.url = '';
      if (audioBook?.image)
        audioBook.image = this.urlService.uploadUrl(audioBook.image);
    }
  }

  async listAudioBook(query: ListAudioBookDto) {
    console.log(query.sortBy);

    const config: PaginateConfig<AudioBook> = {
      sortableColumns: ['updatedAt', 'title'],
      defaultSortBy: [['updatedAt', 'DESC']],
      searchableColumns: ['title'],
      relations: ['author', 'genre'],
    };
    const data = await this.listWithPage(query, config);
    await this.preResponse(data.results, query.user);
    return data;
  }

  async getAudioBook(dto: any) {
    const audioBook = await this.repository.findOne({
      where: { id: dto.id },
      relations: { genre: true, author: true },
    });
    if (!audioBook)
      throw new exc.BadRequest({ message: 'Không tồn tại audio book' });
    console.log(dto);

    await this.preResponse([audioBook], dto.user);
    return audioBook;
  }

  async getAudioBookWithoutImage(id: number) {
    const audioBook = await this.repository.findOne({
      where: { id: id },
    });
    if (!audioBook) throw new exc.BadRequest({ message: 'ko co bai nay' });

    return audioBook;
  }

  async createAudioBook(dto: CreateAudioBookDto) {
    try {
      console.log(dto);

      const authors = await this._findAuthor(dto.author);
      const genre = await this._findGenre(dto.genre);

      let url = null;
      if (dto.audio) {
        url = (await this.encodeHLSWithMultipleAudioStreams(dto.audio)).split(
          '/',
        );
        this.fileService.removeFile(dto.audio, 'audio');
      }

      await this.repository.save({
        author: authors,
        genre: genre,
        title: dto.title,
        desc: dto.desc,
        publishDate: dto.publishDate,
        image: dto.image,
        url: url?.at(-1),
        duration: dto.duration,
      });

      return true;
    } catch (e) {
      this.logger.warn(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }

  async updateAudioBook(dto: UpdateAudioBookDto) {
    const audioBook = await this.getAudioBookWithoutImage(dto.id);

    let authors = null;
    let genre = null;
    if (dto?.author?.length > 0) {
      authors = await this._findAuthor(dto.author);
    }

    if (dto.genre) genre = await this._findGenre(dto.genre);

    if (dto.title) {
      audioBook.title = dto.title;
    }

    if (dto.audio) {
      if (audioBook.url) this.fileService.removeFile(audioBook.url, 'audio');
      const url = (
        await this.encodeHLSWithMultipleAudioStreams(dto.audio)
      ).split('/');
      audioBook.url = url[2];
      this.fileService.removeFile(dto.audio, 'audio');
    }

    audioBook.author = authors?.length > 0 ? authors : audioBook.author;
    audioBook.genre = genre ?? audioBook.genre;
    audioBook.image = dto.image ?? audioBook.image;
    await audioBook.save();
    return true;
  }

  async like(id: number, user?: User) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const check = await queryRunner.manager.findOne(AudioBookLibrary, {
        where: {
          audioBook: { id: id },
          library: { name: 'Yêu thích', user: { id: user.id } },
        },
      });

      const audioBook = await queryRunner.manager.findOne(AudioBook, {
        where: { id: id },
      });

      if (check) {
        audioBook.likes -= 1;
        await queryRunner.manager.delete(AudioBookLibrary, check.id);
      } else {
        audioBook.likes += 1;
        const audioBookLib = new AudioBookLibrary();
        const lib = await queryRunner.manager.findOne(Library, {
          where: { name: 'Yêu thích', user: { id: user.id } },
        });

        audioBookLib.audioBook = audioBook;
        audioBookLib.library = lib;

        await queryRunner.manager.save(audioBookLib);
      }

      await queryRunner.manager.save(audioBook);
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new exc.BadRequest({ message: e.message });
    } finally {
      await queryRunner.release();
    }
  }

  private async getBitrate(filePath: string): Promise<number> {
    try {
      const { stdout } = await execPromise(
        `ffprobe -v error -select_streams a:0 -show_entries stream=bit_rate -of default=nw=1:nk=1 ${filePath}`,
      );
      return Number(stdout.trim());
    } catch (e) {
      throw new exc.BadRequest({ message: e?.message });
    }
  }

  public async encodeHLSWithMultipleAudioStreams(
    audioName: string,
  ): Promise<string> {
    try {
      const inputPath = path.join('audio', audioName);
      const bitrate = await this.getBitrate(inputPath);
      const parentFolder = path.join(inputPath, '..');
      const songName = inputPath.split('/').at(-1).split('.')[0];

      const songFolderPath = path.join(parentFolder, songName);
      // const outputSegmentPath = path.join(
      //   parent_folder,
      //   'a%v/fileSequence%d.ts',
      // );
      // const outputPath = path.join(parent_folder, 'a%v/prog_index.m3u8');
      const outputSegmentPath = path.join(
        parentFolder,
        `${songName}`,
        'fileSequence%d.ts',
      );
      const outputPath = path.join(
        parentFolder,
        `${songName}`,
        `${songName}.m3u8`,
      );

      if (!fs.existsSync(songFolderPath)) {
        fs.mkdirSync(songFolderPath);
      }
      const bitrate128 =
        bitrate > MAXIMUM_BITRATE_128K ? MAXIMUM_BITRATE_128K : bitrate;
      const bitrate256 =
        bitrate > MAXIMUM_BITRATE_256K ? MAXIMUM_BITRATE_256K : bitrate;
      const bitrate320 =
        bitrate > MAXIMUM_BITRATE_320K ? MAXIMUM_BITRATE_320K : bitrate;

      let command = `
        ffmpeg -y -i ${inputPath} \
        -map 0:0 \
        -c:a:0 aac -b:a:0 ${bitrate128} \
        -var_stream_map "a:0" \
        -master_pl_name master.m3u8 \
        -f hls -hls_time 6 -hls_list_size 0 \
        -hls_segment_filename "${outputSegmentPath}" \
        ${outputPath}
      `;

      if (bitrate > bitrate128) {
        command = `
          ffmpeg -y -i ${inputPath} \
          -map 0:0 -map 0:1 -map 0:0 -map 0:1 \
          -c:a:0 aac -b:a:0 ${bitrate128} \
          -c:a:1 aac -b:a:1 ${bitrate256} \
          -var_stream_map "a:0,a:1" \
          -master_pl_name master.m3u8 \
          -f hls -hls_time 6 -hls_list_size 0 \
          -hls_segment_filename "${outputSegmentPath}" \
          ${outputPath}
        `;
      }

      if (bitrate > bitrate256) {
        command = `
          ffmpeg -y -i ${inputPath} \
          -map 0:0 -map 0:1 -map 0:0 -map 0:1 -map 0:0 -map 0:1 \
          -c:a:0 aac -b:a:0 ${bitrate128} \
          -c:a:1 aac -b:a:1 ${bitrate256} \
          -c:a:2 aac -b:a:2 ${bitrate320} \
          -var_stream_map "a:0,a:1,a:2" \
          -master_pl_name master.m3u8 \
          -f hls -hls_time 6 -hls_list_size 0 \
          -hls_segment_filename "${outputSegmentPath}" \
          ${outputPath}
        `;
      }

      return new Promise<string>((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            console.log('Convert thành công');
            resolve(outputPath);
          }
        });
      });
    } catch (e) {
      throw new exc.BadRequest({ message: e?.message });
    }
  }

  private async _findAuthor(author_ids: number[]) {
    if (!author_ids) return [];
    const data = [];
    for (const id of author_ids) {
      const author = await this.authorService.getAuthor(id);
      data.push(author);
    }
    return data;
  }

  private async _findGenre(genre_id: number) {
    return this.genreService.getGenre(genre_id);
  }
}

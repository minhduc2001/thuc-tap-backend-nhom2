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
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(AudioBookService.name);

  async listAudioBook(query: ListAudioBookDto) {
    const config: PaginateConfig<AudioBook> = {
      sortableColumns: ['updatedAt'],
      relations: ['author', 'genre'],
    };
    return this.listWithPage(query, config);
  }

  async getAudioBook(id: number) {
    const audioBook = await this.repository.findOne({ where: { id: id } });
    if (!audioBook)
      throw new exc.BadRequest({ message: 'Không tồn tại audio book' });
    return audioBook;
  }

  async createAudioBook(dto: CreateAudioBookDto) {
    try {
      const authors = await this._findAuthor(dto.author);
      const genre = await this._findGenre(dto.genre);

      return await this.repository.save({
        author: authors,
        genre: genre,
        title: dto.title,
        accomplished: dto.accomplished,
        description: dto.description,
        publicationDate: dto.publicationDate,
        image: dto.file,
      });
    } catch (e) {
      this.logger.warn(e);
      throw new exc.BadRequest({ message: e.message });
    }
  }

  async updateAudioBook(dto: UpdateAudioBookDto) {
    const audioBook = await this.getAudioBook(dto.id);

    const authors = await this._findAuthor(dto.author);
    const genres = await this._findGenre(dto.genre);

    if (dto.title) {
      audioBook.title = dto.title;
    }

    audioBook.author = authors;
    audioBook.genre = genres;
    await audioBook.save();

    await this.repository.update(dto.id, {
      accomplished: dto.accomplished,
      description: dto.description,
      publicationDate: dto.publicationDate,
      image: dto.file,
    });
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
    inputPath: string,
  ): Promise<boolean> {
    try {
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

      return new Promise<boolean>((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
          if (err) {
            reject(err);
          } else {
            console.log('Convert thành công');
            resolve(true);
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

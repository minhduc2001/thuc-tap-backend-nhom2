import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { CreateAudioBookDto } from './dto/create-audio-book.dto';
import { UpdateAudioBookDto } from './dto/update-audio-book.dto';
import * as exc from '@base/api/exception.reslover';

const MAXIMUM_BITRATE_128K = 128 * 10 ** 3; // 128 Kbps
const MAXIMUM_BITRATE_256K = 256 * 10 ** 3; // 256 Kbps
const MAXIMUM_BITRATE_320K = 320 * 10 ** 3; // 320 Kbps

const execPromise = promisify(exec);

@Injectable()
export class AudioBookService {
  create(createAudioBookDto: CreateAudioBookDto) {
    // return 'This action adds a new audioBook';
    console.log(process.cwd());
    return true;
  }

  findAll() {
    console.log(process.cwd());
    return `This action returns all audioBook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audioBook`;
  }

  update(id: number, updateAudioBookDto: UpdateAudioBookDto) {
    return `This action updates a #${id} audioBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} audioBook`;
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
}

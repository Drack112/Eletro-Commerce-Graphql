import {
  BadRequestException,
  Controller,
  HttpException,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Express } from 'express';

@Controller('users')
export class UserController {
  constructor(private uploadService: UploadService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'src/upload',
      }),
    }),
  )
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('Please choose a file');
      }
      const filename = file.filename;
      const fullPath = process.cwd() + `/src/upload/${filename}`;
      await this.uploadService.upload(file.filename, file.mimetype);
      const url = await this.uploadService.getUrl(filename);
      fs.unlink(fullPath, (err) => {
        if (err) throw err;
        Logger.log(`${file.filename} uploaded!`);
      });

      return url;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}

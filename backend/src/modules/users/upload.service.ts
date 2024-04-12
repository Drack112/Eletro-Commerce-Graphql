import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { envConfig } from 'src/common/config/env.config';

@Injectable()
export class UploadService {
  private _uploadDir: string;
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert('src/serviceAccountKey.json'),
      storageBucket: envConfig().firebase.storageBucket,
    });
    this._uploadDir = process.cwd() + '/src/upload';
  }

  public get bucket() {
    const bucket = admin.storage().bucket();
    return bucket;
  }

  public async upload(filename: string, mimetype: string) {
    const fullpath = join(this._uploadDir, filename);
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: uuid(),
      },
      contentType: mimetype,
      cacheControl: 'public, max-age=31536000', // 30mb
    };

    // Uploads a local file to the bucket
    const upload = await this.bucket.upload(fullpath, {
      gzip: true,
      metadata: metadata,
    });

    return upload;
  }

  public async getUrl(filename: string) {
    const file = this.bucket.file(filename);
    const res = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });
    return res[0];
  }
}

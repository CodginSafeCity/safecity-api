import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly client: Client;
  private readonly bucket: string;

  constructor() {
    if (
      !process.env.MINIO_ENDPOINT ||
      !process.env.MINIO_PORT ||
      !process.env.MINIO_ACCESS_KEY ||
      !process.env.MINIO_SECRET_KEY ||
      !process.env.MINIO_BUCKET
    ) {
      throw new Error('❌ Faltan variables de entorno para MinIO');
    }

    this.client = new Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });

    this.bucket = process.env.MINIO_BUCKET;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uniqueName = `${uuid()}-${file.originalname}`;

      await this.client.putObject(
        this.bucket,
        uniqueName,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      return `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucket}/${uniqueName}`;
    } catch (err) {
      this.logger.error(`Error subiendo archivo a MinIO: ${err.message}`);
      throw new InternalServerErrorException('No se pudo subir la evidencia');
    }
  }
}

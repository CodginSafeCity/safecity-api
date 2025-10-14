import * as dotenv from 'dotenv';
dotenv.config();

import { Client } from 'minio';

if (
  !process.env.MINIO_ENDPOINT ||
  !process.env.MINIO_PORT ||
  !process.env.MINIO_ACCESS_KEY ||
  !process.env.MINIO_SECRET_KEY
) {
  throw new Error('❌ Variables de entorno de MinIO faltantes o inválidas');
}

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

import { S3Client } from "@aws-sdk/client-s3";

// Configure S3 client for Tigris
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "auto",
  endpoint: process.env.AWS_ENDPOINT_URL_S3 || "https://fly.storage.tigris.dev",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET || "ai-generation-v0";
export const PUBLIC_ENDPOINT =
  process.env.AWS_S3_PUBLIC_ENDPOINT ||
  "https://ai-generation-v0.fly.storage.tigris.dev";
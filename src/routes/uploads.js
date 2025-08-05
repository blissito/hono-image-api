import { Hono } from "hono";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "crypto";
import { s3Client, BUCKET_NAME, PUBLIC_ENDPOINT } from "../config/s3.js";

const uploads = new Hono();

// Generate presigned URL for upload
uploads.post("/presigned-url", async (c) => {
  try {
    const { filename, content_type } = await c.req.json();

    if (!filename || !content_type) {
      return c.json(
        { error: "Missing required parameters: filename and content_type" },
        400
      );
    }

    // Generate unique key
    const key = `chavy/uploads/${randomUUID()}/${filename}`;

    // Create presigned POST data
    const presignedPost = await createPresignedPost(s3Client, {
      Bucket: BUCKET_NAME,
      Key: key,
      Fields: {
        "Content-Type": content_type,
      },
      Conditions: [
        ["content-length-range", 0, 10485760], // 10MB max
        ["eq", "$Content-Type", content_type],
      ],
      Expires: 900, // 15 minutes
    });

    // Generate download URL
    const downloadUrl = `${PUBLIC_ENDPOINT}/${key}`;

    return c.json({
      key,
      content_type,
      expires_in: 900,
      upload_url: presignedPost.url,
      upload_fields: presignedPost.fields,
      download_url: downloadUrl,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return c.json({ error: "Failed to generate presigned URL" }, 500);
  }
});

// Generate presigned URL for download
uploads.post("/download-url", async (c) => {
  try {
    const { key, expires_in = 3600 } = await c.req.json();

    if (!key) {
      return c.json({ error: "Missing required parameter: key" }, 400);
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires_in,
    });

    return c.json({
      download_url: downloadUrl,
      expires_in,
    });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return c.json({ error: "Failed to generate download URL" }, 500);
  }
});

export default uploads;
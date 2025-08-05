import { Hono } from "hono";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME, PUBLIC_ENDPOINT } from "../config/s3.js";

const gallery = new Hono();

// Get gallery - list all images with presigned URLs
gallery.get("/", async (c) => {
  try {
    // Debug: Check environment variables
    console.log("🔍 DEBUG Environment:");
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "AWS_ACCESS_KEY_ID:",
      process.env.AWS_ACCESS_KEY_ID ? "SET" : "MISSING"
    );
    console.log(
      "AWS_SECRET_ACCESS_KEY:",
      process.env.AWS_SECRET_ACCESS_KEY ? "SET" : "MISSING"
    );
    console.log("AWS_S3_BUCKET:", process.env.AWS_S3_BUCKET_NAME);

    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "chavy/uploads/",
    });

    const response = await s3Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return c.json({ images: [] });
    }

    // Generate presigned URLs for each image (1 hour expiration)
    const images = await Promise.all(
      response.Contents.filter(
        (obj) => obj.Key && obj.Key.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      ).map(async (obj) => {
        try {
          // Generate presigned URL for this image
          const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: obj.Key,
          });

          const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600, // 1 hour
          });

          return {
            key: obj.Key,
            url: presignedUrl,  // Presigned URL directa
            size: obj.Size,
            lastModified: obj.LastModified,
            filename: obj.Key.split("/").pop(),
          };
        } catch (error) {
          console.error(`Error generating presigned URL for ${obj.Key}:`, error);
          return null; // Filtraremos estos después
        }
      })
    );

    // Filter out any failed URLs
    const validImages = images.filter(img => img !== null);

    return c.json({
      images: validImages,
      count: validImages.length,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return c.json({ error: "Failed to fetch gallery" }, 500);
  }
});

// Ya no necesitamos el proxy de imágenes porque devolvemos URLs firmadas directamente

export default gallery;

import { Hono } from "hono";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, BUCKET_NAME, PUBLIC_ENDPOINT } from "../config/s3.js";

const gallery = new Hono();

// Get gallery - list all images with presigned URLs
gallery.get("/", async (c) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: "chavy/uploads/",
    });

    const response = await s3Client.send(command);
    
    if (!response.Contents || response.Contents.length === 0) {
      return c.json({ images: [] });
    }

    // Generate image URLs using our proxy endpoint
    const images = response.Contents
      .filter(obj => obj.Key && obj.Key.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map((obj) => {
        // Extract the path after "chavy/uploads/"
        const pathParts = obj.Key.split('chavy/uploads/')[1];
        const proxyUrl = `https://hono-chavy.fly.dev/api/images/${pathParts}`;
        
        return {
          key: obj.Key,
          url: proxyUrl,
          directUrl: `${PUBLIC_ENDPOINT}/${obj.Key}`,
          size: obj.Size,
          lastModified: obj.LastModified,
          filename: obj.Key.split('/').pop(),
        };
      });

    return c.json({
      images,
      count: images.length,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return c.json({ error: "Failed to fetch gallery" }, 500);
  }
});

// Serve images (redirect to S3)
gallery.get("/:uuid/:filename", async (c) => {
  try {
    const uuid = c.req.param("uuid");
    const filename = c.req.param("filename");
    
    console.log("Serving image uuid:", uuid, "filename:", filename);
    
    if (!uuid || !filename) {
      return c.json({ error: "UUID and filename are required" }, 400);
    }
    
    const key = `chavy/uploads/${uuid}/${filename}`;
    console.log("S3 key:", key);

    // Generate signed URL and redirect
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return c.redirect(signedUrl, 302);
  } catch (error) {
    console.error("Error serving image:", error);
    return c.json({ error: "Image not found" }, 404);
  }
});

export default gallery;
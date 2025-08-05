// Health check endpoint
export const healthCheck = (c) => {
  return c.json({
    status: "ok",
    service: "Hono Image Upload API with SDK",
    endpoints: {
      presigned_url: "POST /api/uploads/presigned-url",
      download_url: "POST /api/uploads/download-url",
      gallery: "GET /api/gallery",
      images: "GET /api/images/:uuid/:filename",
      sdk: "GET /sdk/image-api.js",
      example: "GET /sdk/example",
    },
  });
};
import 'dotenv/config';
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { corsMiddleware } from "./src/utils/cors.js";
import { healthCheck } from "./src/utils/health.js";
import uploads from "./src/routes/uploads.js";
import gallery from "./src/routes/gallery.js";
import sdk from "./src/routes/sdk.js";

const app = new Hono();

// Middleware for CORS
app.use("*", corsMiddleware);

// Health check
app.get("/", healthCheck);

// Mount route modules
app.route("/api/uploads", uploads);
app.route("/api/gallery", gallery);
app.route("/sdk", sdk); // SDK endpoints



// Start server
const port = parseInt(process.env.PORT || "3000");
console.log(`🚀 Hono Image API server starting on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
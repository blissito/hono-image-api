import { Hono } from "hono";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const sdk = new Hono();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve the SDK JavaScript file
sdk.get("/image-api.js", async (c) => {
  try {
    const sdkPath = join(__dirname, "../sdk/image-api.js");
    const sdkContent = readFileSync(sdkPath, "utf-8");
    
    // Set proper headers for JavaScript
    c.header("Content-Type", "application/javascript; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    
    return c.text(sdkContent);
  } catch (error) {
    console.error("Error serving SDK:", error);
    return c.text("// Error loading SDK", 500);
  }
});

// Serve the example HTML page
sdk.get("/example", async (c) => {
  try {
    // Try multiple possible paths for the example file
    const possiblePaths = [
      join(process.cwd(), 'static', 'example.html'),  // Production path
      join(__dirname, '../../static/example.html'),   // Local development path
      join(__dirname, '../../../static/example.html') // Alternative path
    ];
    
    let exampleContent;
    let lastError;
    
    for (const examplePath of possiblePaths) {
      try {
        exampleContent = readFileSync(examplePath, 'utf-8');
        console.log('Serving example from:', examplePath);
        break;
      } catch (err) {
        lastError = err;
        console.log(`Path not found: ${examplePath}`);
      }
    }
    
    if (!exampleContent) {
      throw lastError || new Error('Could not find example.html in any of the expected locations');
    }
    
    c.header("Content-Type", "text/html; charset=utf-8");
    return c.html(exampleContent);
  } catch (error) {
    console.error("Error serving example:", error);
    return c.text(`Error loading example page: ${error.message}`, 500);
  }
});

export default sdk;
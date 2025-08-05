import { Hono } from "hono";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const sdk = new Hono();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Cache for the found example path
let cachedExamplePath = null;

// Serve the example HTML page
sdk.get("/example", async (c) => {
  try {
    // Get the absolute path to the project root
    const projectRoot = process.cwd();
    
    // If we already found the path in a previous request, use it
    if (cachedExamplePath) {
      try {
        const exampleContent = readFileSync(cachedExamplePath, 'utf-8');
        console.log(`✅ Serving from cached path: ${cachedExamplePath}`);
        c.header("Content-Type", "text/html; charset=utf-8");
        c.header("X-Example-Path", cachedExamplePath);
        return c.html(exampleContent);
      } catch (e) {
        console.log(`❌ Cached path no longer valid: ${cachedExamplePath}`);
        cachedExamplePath = null; // Reset cache if file was moved/deleted
      }
    }
    
    console.log('🔍 Searching for example.html in:', projectRoot);
    console.log('🔍 Current directory contents:', readdirSync(projectRoot));
    console.log('🔍 __dirname:', __dirname);
    
    // Try to find the static directory
    const possibleStaticDirs = [
      'static',
      'public/static',
      'dist/static',
      'build/static',
      '../static',
      '../../static',
      join(__dirname, '../../static'),
      join(__dirname, '../../../static'),
      // Try absolute paths that might work in Fly.io
      '/app/static',
      '/app/src/static',
      '/app/dist/static',
      '/app/build/static'
    ];
    
    let exampleContent;
    let foundPath = '';
    
    // Try each possible static directory
    for (const staticDir of possibleStaticDirs) {
      const examplePath = join(projectRoot, staticDir, 'example.html');
      try {
        exampleContent = readFileSync(examplePath, 'utf-8');
        foundPath = examplePath;
        cachedExamplePath = foundPath; // Cache the found path
        console.log(`✅ Found and cached example at: ${foundPath}`);
        console.log('📌 Next requests will use this path directly');
        break;
      } catch (err) {
        console.log(`❌ Not found: ${examplePath}`);
      }
    }
    
    if (!exampleContent) {
      // List directory contents for debugging
      try {
        console.log('📂 Current directory contents:', readdirSync(projectRoot));
        console.log('📁 Parent directory contents:', readdirSync(join(projectRoot, '..')));
      } catch (e) {
        console.error('Error listing directories:', e);
      }
      
      throw new Error(`Could not find example.html in any of the expected locations. Current dir: ${projectRoot}`);
    }
    
    c.header("Content-Type", "text/html; charset=utf-8");
    c.header("X-Example-Path", foundPath);
    c.header("X-Cached-Path", "false");
    return c.html(exampleContent);
  } catch (error) {
    console.error("❌ Error serving example:", error);
    return c.text(`Error loading example page: ${error.message}`, 500);
  }
});

export default sdk;
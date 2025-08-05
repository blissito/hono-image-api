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
    // Get the absolute path to the project root
    const projectRoot = process.cwd();
    console.log('Current working directory:', projectRoot);
    
    // Try to find the static directory
    const possibleStaticDirs = [
      'static',
      'public/static',
      'dist/static',
      'build/static',
      '../static',
      '../../static',
      join(__dirname, '../../static'),
      join(__dirname, '../../../static')
    ];
    
    let exampleContent;
    let foundPath = '';
    
    // Try each possible static directory
    for (const staticDir of possibleStaticDirs) {
      const examplePath = join(projectRoot, staticDir, 'example.html');
      try {
        exampleContent = readFileSync(examplePath, 'utf-8');
        foundPath = examplePath;
        console.log('✅ Found example at:', examplePath);
        break;
      } catch (err) {
        console.log(`❌ Not found: ${examplePath}`);
      }
    }
    
    if (!exampleContent) {
      // List directory contents for debugging
      try {
        console.log('Current directory contents:', require('fs').readdirSync(projectRoot));
        console.log('Parent directory contents:', require('fs').readdirSync(join(projectRoot, '..')));
      } catch (e) {
        console.error('Error listing directories:', e);
      }
      
      throw new Error(`Could not find example.html in any of the expected locations. Current dir: ${projectRoot}`);
    }
    
    c.header("Content-Type", "text/html; charset=utf-8");
    c.header("X-Example-Path", foundPath); // For debugging
    return c.html(exampleContent);
  } catch (error) {
    console.error("❌ Error serving example:", error);
    return c.text(`Error loading example page: ${error.message}`, 500);
  }
});

export default sdk;
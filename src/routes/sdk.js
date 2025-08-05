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

// Serve a simple example HTML page
sdk.get("/example", async (c) => {
  const exampleHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🌟 Ejemplo Image API SDK</title>
    <style>
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin: 20px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        h1 {
            text-align: center;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .subtitle {
            text-align: center;
            opacity: 0.9;
            margin-bottom: 30px;
        }
        
        button {
            background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
            border: none;
            color: white;
            padding: 15px 30px;
            font-size: 16px;
            border-radius: 50px;
            cursor: pointer;
            margin: 10px;
            transition: transform 0.2s;
            font-weight: bold;
        }
        
        button:hover {
            transform: scale(1.05);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .image-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 15px;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
        }
        
        .image-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 10px;
        }
        
        .image-name {
            font-size: 14px;
            opacity: 0.9;
            word-break: break-all;
        }
        
        .loading {
            text-align: center;
            font-size: 18px;
            margin: 20px 0;
        }
        
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 15px;
            border-radius: 10px;
            display: block;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Image API SDK</h1>
        <p class="subtitle">¡Súper fácil de usar! 🎨</p>
        
        <div style="text-align: center;">
            <button onclick="selectAndUploadImage()" id="uploadBtn">
                📤 Subir Imagen
            </button>
            <button onclick="loadGallery()">
                🖼️ Ver Galería
            </button>
        </div>
        
        <div id="loading" class="loading" style="display: none;">
            🔄 Cargando...
        </div>
        
        <div id="gallery" class="gallery"></div>
    </div>

    <div class="container">
        <h2>📚 Cómo usar en tu HTML:</h2>
        <p>1. Incluye el SDK en tu página:</p>
        <code>&lt;script src="https://hono-chavy.fly.dev/sdk/image-api.js"&gt;&lt;/script&gt;</code>
        
        <p>2. Sube una imagen:</p>
        <code>// Seleccionar archivo y subirlo
async function subirImagen(file) {
    const result = await ImageAPI.uploadImage(file);
    if (result.success) {
        console.log('¡Subida exitosa!', result.downloadUrl);
        ImageAPI.showMessage(result.message, 'success');
    } else {
        ImageAPI.showMessage(result.error, 'error');
    }
}</code>
        
        <p>3. Ver la galería:</p>
        <code>// Obtener todas las imágenes
async function verGaleria() {
    const gallery = await ImageAPI.getGallery();
    console.log(\`Tienes \${gallery.count} imágenes\`);
    gallery.images.forEach(img => {
        console.log(img.filename, img.url);
    });
}</code>
    </div>

    <!-- Incluir nuestro SDK -->
    <script src="https://hono-chavy.fly.dev/sdk/image-api.js"></script>
    
    <script>
        // Funciones de ejemplo
        function selectAndUploadImage() {
            const input = ImageAPI.createFileInput(async (file) => {
                const uploadBtn = document.getElementById('uploadBtn');
                uploadBtn.disabled = true;
                uploadBtn.textContent = '📤 Subiendo...';
                
                const result = await ImageAPI.uploadImage(file);
                
                if (result.success) {
                    ImageAPI.showMessage(result.message, 'success');
                    // Recargar galería después de subir
                    setTimeout(loadGallery, 1000);
                } else {
                    ImageAPI.showMessage(result.error, 'error');
                }
                
                uploadBtn.disabled = false;
                uploadBtn.textContent = '📤 Subir Imagen';
            });
            
            input.click();
        }
        
        async function loadGallery() {
            const loading = document.getElementById('loading');
            const galleryEl = document.getElementById('gallery');
            
            loading.style.display = 'block';
            galleryEl.innerHTML = '';
            
            const gallery = await ImageAPI.getGallery();
            loading.style.display = 'none';
            
            if (gallery.success && gallery.count > 0) {
                gallery.images.forEach(image => {
                    const card = document.createElement('div');
                    card.className = 'image-card';
                    card.innerHTML = \`
                        <img src="\${image.url}" alt="\${image.filename}" loading="lazy">
                        <div class="image-name">\${image.filename}</div>
                    \`;
                    galleryEl.appendChild(card);
                });
            } else {
                galleryEl.innerHTML = '<p style="text-align: center; opacity: 0.7;">🤷‍♀️ No hay imágenes aún. ¡Sube tu primera imagen!</p>';
                if (!gallery.success) {
                    ImageAPI.showMessage(gallery.error, 'error');
                }
            }
        }
        
        // Cargar galería al inicio
        loadGallery();
    </script>
</body>
</html>`;

  c.header("Content-Type", "text/html; charset=utf-8");
  return c.html(exampleHTML);
});

export default sdk;
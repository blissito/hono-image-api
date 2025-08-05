# 🌟 Image API SDK - ¡Súper Fácil!

Un SDK JavaScript súper simple para subir y manejar imágenes. Perfecto para principiantes! 🎨

## 🚀 Cómo usar

### 1. Incluye el SDK en tu HTML

```html
<script src="https://hono-chavy.fly.dev/sdk/image-api.js"></script>
```

### 2. ¡Ya puedes usar las funciones!

```javascript
// 📤 Subir una imagen
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
    const file = e.target.files[0];
    const result = await ImageAPI.uploadImage(file);
    
    if (result.success) {
        console.log('¡Subida exitosa!', result.downloadUrl);
        ImageAPI.showMessage(result.message, 'success');
    }
};

// 🖼️ Ver todas las imágenes
async function verGaleria() {
    const gallery = await ImageAPI.getGallery();
    console.log(`Tienes ${gallery.count} imágenes`);
    
    gallery.images.forEach(img => {
        console.log(img.filename, img.url);
    });
}

// 🔗 Obtener URL de descarga
async function obtenerURL(key) {
    const result = await ImageAPI.getDownloadUrl(key);
    if (result.success) {
        console.log('URL:', result.downloadUrl);
    }
}
```

## 📚 Funciones Disponibles

### `ImageAPI.uploadImage(file)`
Sube un archivo de imagen y devuelve la información.

**Parámetros:**
- `file` (File): El archivo a subir

**Devuelve:**
```javascript
{
    success: true,
    key: "chavy/uploads/uuid/filename.jpg",
    filename: "mi-imagen.jpg",
    downloadUrl: "https://...",
    message: "¡Tu imagen se subió correctamente!"
}
```

### `ImageAPI.getGallery()`
Obtiene todas las imágenes de la galería.

**Devuelve:**
```javascript
{
    success: true,
    images: [
        {
            key: "chavy/uploads/uuid/filename.jpg",
            url: "https://hono-chavy.fly.dev/api/images/.../filename.jpg",
            directUrl: "https://...",
            filename: "mi-imagen.jpg",
            size: 12345,
            lastModified: "2025-08-05T..."
        }
    ],
    count: 1
}
```

### `ImageAPI.getDownloadUrl(key, expiresIn)`
Genera una URL de descarga temporal.

**Parámetros:**
- `key` (string): La clave de la imagen
- `expiresIn` (number): Segundos hasta expirar (por defecto 3600)

### `ImageAPI.createFileInput(callback)`
Crea un input de archivo invisible para seleccionar imágenes.

### `ImageAPI.showMessage(message, type)`
Muestra un mensaje bonito en la pantalla.

**Parámetros:**
- `message` (string): El mensaje a mostrar
- `type` (string): 'success', 'error', o 'info'

## 🎨 Ejemplo Completo

Visita: https://hono-chavy.fly.dev/sdk/example

## 🤝 ¿Necesitas Ayuda?

El SDK es súper amigable y muestra mensajes claros en la consola. Solo abre las herramientas de desarrollador (F12) y verás todo lo que está pasando!

¡Diviértete creando tu galería de imágenes! 🎉
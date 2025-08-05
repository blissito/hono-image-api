# Hono Image API with SDK

Una API de imágenes simple construida con Hono.js que permite subir, descargar y gestionar imágenes almacenadas en AWS S3. Incluye un SDK fácil de usar para integración en aplicaciones web.

Creado con ❤️ por [Blissito](https://github.com/blissito) para el cumpleaños de Chavy. 👵🏼

## 🚀 Características

- Subida de imágenes a AWS S3
- Generación de URLs de descarga temporales
- Galería de imágenes
- SDK ligero para el cliente
- Soporte para múltiples formatos de imagen (excepto AVIF)
- Interfaz de ejemplo incluida

## 🛠️ Requisitos Previos

- Node.js 16 o superior
- Cuenta de AWS con acceso a S3
- Credenciales de AWS configuradas

## 🔧 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/hono-image-api.git
   cd hono-image-api
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno. Crea un archivo `.env` en la raíz del proyecto con:
   ```
   AWS_ACCESS_KEY_ID=tu_access_key
   AWS_SECRET_ACCESS_KEY=tu_secret_key
   AWS_REGION=tu_region
   AWS_S3_BUCKET=nombre_de_tu_bucket
   ```

## 🚀 Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 🌟 Uso del SDK

### En el navegador:

```html
<script src="https://tu-dominio.com/image-api.js"></script>
<script>
  // Configura la URL base de tu API
  ImageAPI.init({
    baseURL: "https://tu-dominio.com/api",
  });

  // Subir una imagen
  async function uploadImage(file) {
    try {
      const result = await ImageAPI.uploadImage(file);
      console.log("Imagen subida:", result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
</script>
```

### Métodos disponibles

- `uploadImage(file)`: Sube una imagen al servidor
- `getGallery()`: Obtiene la lista de imágenes en la galería
- `getDownloadUrl(key)`: Genera una URL de descarga temporal
- `deleteImage(key)`: Elimina una imagen

## 🚫 Formatos no soportados

Por el momento, no se permite la subida de archivos en formato AVIF.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙋‍♂️ Soporte

Si tienes preguntas o necesitas ayuda, por favor abre un issue en el repositorio.

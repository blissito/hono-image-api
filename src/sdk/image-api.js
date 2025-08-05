/**
 * 🌟 Simple Image API SDK 🌟
 * Para subir y descargar imágenes súper fácil!
 * 
 * Cómo usar:
 * 1. Incluye este script en tu HTML: <script src="https://hono-chavy.fly.dev/sdk/image-api.js"></script>
 * 2. Usa las funciones: ImageAPI.uploadImage(), ImageAPI.getGallery(), etc.
 */

window.ImageAPI = {
  // URL base de la API
  baseURL: 'https://hono-chavy.fly.dev',

  /**
   * 📤 Subir una imagen
   * @param {File} file - El archivo de imagen a subir
   * @param {function} onProgress - Función que se llama durante la subida (opcional)
   * @returns {Promise} - Promesa que resuelve con la información de la imagen subida
   */
  async uploadImage(file, onProgress) {
    try {
      // Verificar que sea un archivo de imagen
      if (!file.type.startsWith('image/')) {
        throw new Error('❌ Solo se pueden subir imágenes (jpg, png, gif, etc.)');
      }

      // Obtener URL de subida
      console.log('🔄 Generando URL de subida...');
      const response = await fetch(`${this.baseURL}/api/uploads/presigned-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error('❌ Error generando URL de subida');
      }

      const uploadData = await response.json();
      console.log('✅ URL de subida generada');

      // Subir el archivo usando FormData
      const formData = new FormData();
      
      // Agregar todos los campos requeridos por S3
      Object.keys(uploadData.upload_fields).forEach(key => {
        formData.append(key, uploadData.upload_fields[key]);
      });
      
      // Agregar el archivo al final
      formData.append('file', file);

      console.log('📤 Subiendo imagen...');
      const uploadResponse = await fetch(uploadData.upload_url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('❌ Error subiendo la imagen');
      }

      console.log('🎉 ¡Imagen subida exitosamente!');
      
      // Retornar información útil
      return {
        success: true,
        key: uploadData.key,
        filename: file.name,
        downloadUrl: uploadData.download_url,
        message: '🎉 ¡Tu imagen se subió correctamente!'
      };

    } catch (error) {
      console.error('💥 Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * 🖼️ Obtener todas las imágenes de la galería
   * @returns {Promise} - Promesa que resuelve con la lista de imágenes
   */
  async getGallery() {
    try {
      console.log('🔄 Cargando galería...');
      const response = await fetch(`${this.baseURL}/api/gallery`);
      
      if (!response.ok) {
        throw new Error('❌ Error cargando la galería');
      }

      const data = await response.json();
      console.log(`✅ Galería cargada: ${data.count} imágenes`);
      
      return {
        success: true,
        images: data.images,
        count: data.count
      };

    } catch (error) {
      console.error('💥 Error:', error.message);
      return {
        success: false,
        error: error.message,
        images: [],
        count: 0
      };
    }
  },

  /**
   * 🔗 Obtener URL de descarga temporal para una imagen
   * @param {string} key - La clave de la imagen en S3
   * @param {number} expiresIn - Tiempo de expiración en segundos (por defecto 1 hora)
   * @returns {Promise} - Promesa que resuelve con la URL de descarga
   */
  async getDownloadUrl(key, expiresIn = 3600) {
    try {
      console.log('🔄 Generando URL de descarga...');
      const response = await fetch(`${this.baseURL}/api/uploads/download-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          expires_in: expiresIn
        }),
      });

      if (!response.ok) {
        throw new Error('❌ Error generando URL de descarga');
      }

      const data = await response.json();
      console.log('✅ URL de descarga generada');
      
      return {
        success: true,
        downloadUrl: data.download_url,
        expiresIn: data.expires_in
      };

    } catch (error) {
      console.error('💥 Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * 🎨 Función helper para crear un input de archivo fácil
   * @param {function} onFileSelected - Función que se llama cuando se selecciona un archivo
   * @returns {HTMLElement} - Elemento input de archivo
   */
  createFileInput(onFileSelected) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && onFileSelected) {
        onFileSelected(file);
      }
    });
    
    document.body.appendChild(input);
    return input;
  },

  /**
   * 📱 Función helper para mostrar mensajes bonitos
   * @param {string} message - El mensaje a mostrar
   * @param {string} type - Tipo de mensaje: 'success', 'error', 'info'
   */
  showMessage(message, type = 'info') {
    // Crear elemento de mensaje
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    
    // Estilos básicos
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 9999;
      max-width: 300px;
      word-wrap: break-word;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    // Colors según el tipo
    const colors = {
      success: '#4CAF50',
      error: '#f44336',
      info: '#2196F3'
    };
    messageEl.style.backgroundColor = colors[type] || colors.info;

    // Agregar al DOM
    document.body.appendChild(messageEl);
    
    // Animación de entrada
    setTimeout(() => {
      messageEl.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      messageEl.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300);
    }, 4000);
  }
};

// Mensaje de bienvenida cuando se carga el SDK
console.log(`
🌟 ¡Image API SDK cargado correctamente! 🌟

Funciones disponibles:
• ImageAPI.uploadImage(file) - Subir una imagen
• ImageAPI.getGallery() - Ver todas las imágenes
• ImageAPI.getDownloadUrl(key) - Obtener URL de descarga
• ImageAPI.createFileInput(callback) - Crear input de archivo
• ImageAPI.showMessage(text, type) - Mostrar mensajes

¡Diviértete creando tu galería de imágenes! 🎨
`);
// Forzar HTTPS solo en GitHub Pages
if (window.location.hostname.includes('github.io') && window.location.protocol === 'http:') {
  window.location.href = window.location.href.replace('http:', 'https:');
}

// Obtener referencias a los elementos del DOM
const video = document.getElementById('video')
let faceCanvas = document.getElementById('face')

// Configurar la URL base para cargar los modelos de detección facial
const modelsUrlBase = window.location.hostname.includes('github.io')
  ? 'https://derpmagician.github.io/tts_vtt_example/models'
  : './models';

console.log('Cargando modelos desde:', modelsUrlBase); // Debug log

// Función para cargar los modelos con manejo de errores
async function loadModels() {
  try {
    console.log('Iniciando carga de modelos...'); // Debug log
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrlBase),     // Detector de caras ligero
      faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrlBase),    // Puntos de referencia facial
      faceapi.nets.faceRecognitionNet.loadFromUri(modelsUrlBase),   // Reconocimiento facial
      faceapi.nets.faceExpressionNet.loadFromUri(modelsUrlBase),    // Detección de expresiones
      faceapi.nets.ageGenderNet.loadFromUri(modelsUrlBase),         // Detección de edad y género
    ]);
    console.log('Modelos cargados exitosamente'); // Debug log
    startVideo();
  } catch (error) {
    console.error('Error al cargar los modelos:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.textContent = 'Error al cargar los modelos de detección facial. Por favor, verifica tu conexión a internet y recarga la página.';
    video.parentNode.insertBefore(errorDiv, video);
  }
}

// Función para iniciar la transmisión de video con mejor manejo de errores
async function startVideo() {
  try {
    // Verificar si navigator.mediaDevices está disponible
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('La API de MediaDevices no está soportada en este navegador');
    }

    console.log('Solicitando acceso a la cámara...'); // Debug log

    // Opciones para la cámara
    const constraints = {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      }
    };

    // Solicitar acceso a la cámara de manera más robusta
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    
    // Manejar el evento loadedmetadata para asegurar que el video está listo
    video.addEventListener('loadedmetadata', () => {
      console.log('Video metadata cargada. Dimensiones:', video.videoWidth, 'x', video.videoHeight);
      video.play(); // Intentar reproducir el video explícitamente
    });

    // Agregar mensaje de éxito en la consola
    console.log('Cámara iniciada exitosamente');
  } catch (err) {
    console.error('Error al acceder a la cámara:', err);
    // Mostrar mensaje de error más descriptivo
    let errorMessage = 'Error al acceder a la cámara: ';
    
    switch(err.name) {
      case 'NotAllowedError':
        errorMessage += 'Permiso denegado. Por favor, permite el acceso a la cámara.';
        break;
      case 'NotFoundError':
        errorMessage += 'No se encontró ninguna cámara.';
        break;
      case 'NotReadableError':
        errorMessage += 'La cámara está en uso por otra aplicación.';
        break;
      case 'SecurityError':
        errorMessage += 'Error de seguridad. Asegúrate de usar HTTPS en producción.';
        break;
      default:
        errorMessage += err.message;
    }
    
    // Mostrar el error en la página
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.padding = '10px';
    errorDiv.textContent = errorMessage;
    video.parentNode.insertBefore(errorDiv, video);
  }
}

// Iniciar la carga de modelos
loadModels();

// Evento que se dispara cuando el video comienza a reproducirse
video.addEventListener('play', () => {
  // Función para verificar que el video tiene dimensiones válidas
  const checkVideoDimensions = () => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(faceCanvas, displaySize);

      // Configurar intervalo para detectar y dibujar características faciales
      setInterval(async () => {
        // Detectar todas las caras y sus características
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();
        
        // Ajustar las detecciones al tamaño de visualización
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Limpiar el canvas antes de dibujar
        faceCanvas.getContext('2d').clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        
        // Dibujar las detecciones, puntos de referencia y expresiones
        faceapi.draw.drawDetections(faceCanvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(faceCanvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(faceCanvas, resizedDetections);
        
        // Dibujar edad y género para cada cara detectada
        resizedDetections.forEach(detection => {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender });
          drawBox.draw(faceCanvas);
        });
      }, 100); // Actualizar cada 100ms
    } else {
      // Si el video aún no tiene dimensiones, reintentar
      setTimeout(checkVideoDimensions, 100);
    }
  };

  checkVideoDimensions();
});

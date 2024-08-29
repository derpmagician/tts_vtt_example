const video = document.getElementById('video')
let faceCanvas = document.getElementById('face')

const modelsUrlBase = window.location.origin === 'https://derpmagician.github.io'
  ? 'https://derpmagician.github.io/tts_vtt_example/models'
  : '/models';

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(modelsUrlBase),
  faceapi.nets.faceLandmark68Net.loadFromUri(modelsUrlBase),
  faceapi.nets.faceRecognitionNet.loadFromUri(modelsUrlBase),
  faceapi.nets.faceExpressionNet.loadFromUri(modelsUrlBase),
  faceapi.nets.ageGenderNet.loadFromUri(modelsUrlBase),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  // Asegurarse de que el video tiene dimensiones válidas
  const checkVideoDimensions = () => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      faceapi.matchDimensions(faceCanvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceCanvas.getContext('2d').clearRect(0, 0, faceCanvas.width, faceCanvas.height);
        faceapi.draw.drawDetections(faceCanvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(faceCanvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(faceCanvas, resizedDetections);
        resizedDetections.forEach(detection => {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender });
          drawBox.draw(faceCanvas);
        });
      }, 100);
    } else {
      // Reintentar verificar dimensiones después de un breve retraso
      setTimeout(checkVideoDimensions, 100);
    }
  };

  checkVideoDimensions();
});


const video = document.getElementById('video')
let faceCanvas = document.getElementById('face')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
  faceapi.nets.ageGenderNet.loadFromUri("/models"),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


video.addEventListener('play', () => {

  if (!faceCanvas) {
    faceCanvas = faceapi.createCanvasFromMedia(video);
    document.body.append(faceCanvas); // Append the canvas to the body
  }

  // const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  console.log("displaySize", displaySize);
  faceapi.matchDimensions(faceCanvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    faceCanvas.getContext('2d').clearRect(0, 0, faceCanvas.width, faceCanvas.height)
    faceapi.draw.drawDetections(faceCanvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(faceCanvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(faceCanvas, resizedDetections)
    resizedDetections.forEach( detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(faceCanvas)
    })
  }, 100)
})

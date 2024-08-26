const transcribeBtn = document.getElementById('transcribe-btn');
const stopTranscribeBtn = document.getElementById('stop-transcribe-btn');
const loadingElement = document.querySelector('.loading');

let recognition; // Variable global para almacenar la instancia de reconocimiento

function stopTranscription() {
  if (recognition) {
    recognition.stop();
    transcribeBtn.disabled = false;
    stopTranscribeBtn.disabled = true;
    loadingElement.style.display = 'none';
  }
}

// Función para convertir voz a texto
async function voiceToText() {
  try {
    // Desactiva el botón de transcripción
    transcribeBtn.disabled = true;
    stopTranscribeBtn.disabled = false;
    loadingElement.style.display = 'inline';

    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onerror = function (event) {
      console.error('Recognition error:', event.error);
      // Reactiva el botón si ocurre un error
      transcribeBtn.disabled = false;
      stopTranscribeBtn.disabled = true;

      loadingElement.style.display = 'none';
    };

    recognition.onstart = function () {
      console.log('Recognition started');
    };

    recognition.onend = function () {
      console.log('Recognition ended');
      // Reactiva el botón cuando la transcripción termina
      // transcribeBtn.disabled = false;
      // loadingElement.style.display = 'none';
    };

    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      document.getElementById('output-text').value = transcript;
      // console.log(transcript);
    };

    recognition.start();
  } catch (err) {
    console.error(err);
    const transcribeBtn = document.getElementById('transcribe-btn');
    transcribeBtn.disabled = false;
  }
}
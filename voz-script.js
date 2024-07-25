// script.js

// Función para cargar las voces disponibles
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voice-select');

  // Limpiar opciones previas
  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    if (voice.lang.startsWith('es')) { // Filtrar solo voces en español
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    }
  });
}

// Llama a loadVoices cuando las voces están cargadas
window.speechSynthesis.onvoiceschanged = loadVoices;

// Función para convertir texto a voz
function textToSpeech() {
  const text = document.getElementById('input-text').value;
  if (text === '') {
    alert("Por favor ingresa algún texto");
    return;
  }

  const msg = new SpeechSynthesisUtterance();
  msg.text = text;

  const selectedVoiceIndex = document.getElementById('voice-select').value;
  const voices = window.speechSynthesis.getVoices();
  msg.voice = voices[selectedVoiceIndex];

  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;

  window.speechSynthesis.speak(msg);
}

// Función para convertir voz a texto
async function voiceToText() {
  try {
    // Desactiva el botón de transcripción
    const transcribeBtn = document.getElementById('transcribe-btn');
    const loadingElement = document.querySelector('.loading');
    transcribeBtn.disabled = true;
    loadingElement.style.display = 'inline';

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      document.getElementById('output-text').value = transcript;
      console.log(transcript);

      // Reactiva el botón de transcripción después de la transcripción
      transcribeBtn.disabled = false;
      loadingElement.style.display = 'none';
    };

    recognition.start();
  } catch (err) {
    console.error(err);

    // En caso de error, también es buena práctica reactivar el botón
    const transcribeBtn = document.getElementById('transcribe-btn');
    transcribeBtn.disabled = false;
  }
}

// Cargar las voces al iniciar la página
window.addEventListener('load', loadVoices);

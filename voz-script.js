// Script para la funcionalidad de texto a voz (Text-to-Speech)

// Función para cargar las voces disponibles en el sistema
function loadVoices() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voice-select');

  // Limpiar el selector de voces
  voiceSelect.innerHTML = '';

  // Filtrar y agregar solo las voces en español al selector
  voices.forEach((voice, index) => {
    if (voice.lang.startsWith('es')) { // Filtrar solo voces en español
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    }
  });
}

// Registrar el evento para cuando las voces estén disponibles
window.speechSynthesis.onvoiceschanged = loadVoices;

// Función principal para convertir texto a voz
function textToSpeech() {
  // Obtener el texto a convertir
  const text = document.getElementById('input-text').value;
  
  // Validar que haya texto para convertir
  if (text === '') {
    alert("Por favor ingresa algún texto");
    return;
  }

  // Configurar el objeto de síntesis de voz
  const msg = new SpeechSynthesisUtterance();
  msg.text = text;

  // Establecer la voz seleccionada
  const selectedVoiceIndex = document.getElementById('voice-select').value;
  const voices = window.speechSynthesis.getVoices();
  msg.voice = voices[selectedVoiceIndex];

  // Configurar parámetros de la voz
  msg.volume = 1;  // Volumen máximo
  msg.rate = 1;    // Velocidad normal
  msg.pitch = 1;   // Tono normal

  // Iniciar la síntesis de voz
  window.speechSynthesis.speak(msg);
}

// Cargar las voces cuando la página se carga completamente
window.addEventListener('load', loadVoices);

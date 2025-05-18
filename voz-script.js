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
  const statusElement = document.createElement('div');
    // Validar que haya texto para convertir
  if (text === '') {    // Crear y mostrar mensaje de error accesible
    statusElement.setAttribute('role', 'alert');
    statusElement.setAttribute('aria-live', 'assertive');
    statusElement.textContent = "Por favor ingresa algún texto";
    statusElement.className = 'error-message';
    
    // Mostrar mensaje visual de error
    const inputText = document.getElementById('input-text');
    inputText.setAttribute('aria-invalid', 'true');
    
    // Insertar el mensaje de error después del área de texto
    const ttsContainer = document.getElementById('tts_container');
    const speechButton = document.querySelector('[onclick="textToSpeech()"]');
    ttsContainer.insertBefore(statusElement, speechButton.parentNode);
    
    // Eliminar mensaje después de un tiempo
    setTimeout(() => {
      if (ttsContainer.contains(statusElement)) {
        ttsContainer.removeChild(statusElement);
      }
      inputText.setAttribute('aria-invalid', 'false');
    }, 5000);
    
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
  // Agregar eventos para actualizar el estado de accesibilidad
  msg.onstart = function() {
    // Crear mensaje accesible de estado
    const statusElement = document.createElement('div');
    statusElement.id = 'tts-status';
    statusElement.setAttribute('role', 'status');
    statusElement.setAttribute('aria-live', 'polite');
    statusElement.className = 'sr-only';
    statusElement.textContent = "Reproduciendo texto en voz";
    document.body.appendChild(statusElement);
    
    // Actualizar estado visual
    const button = document.querySelector('[onclick="textToSpeech()"]');
    button.textContent = 'Reproduciendo...';
    button.setAttribute('aria-label', 'La síntesis de voz está en progreso');
  };
  
  msg.onend = function() {
    // Actualizar mensaje accesible de estado
    const statusElement = document.getElementById('tts-status');
    if (statusElement) {
      statusElement.textContent = "Reproducción de voz finalizada";
      setTimeout(() => {
        document.body.removeChild(statusElement);
      }, 1000);
    }
    
    // Restaurar estado visual
    const button = document.querySelector('[onclick="textToSpeech()"]');
    button.textContent = 'Leer texto escrito';
    button.setAttribute('aria-label', 'Convertir texto a voz');
  };
  
  // Iniciar la síntesis de voz
  window.speechSynthesis.speak(msg);
}

// Cargar las voces cuando la página se carga completamente
window.addEventListener('load', loadVoices);

// Función para cancelar la síntesis de voz en curso
function cancelSpeech() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    
    // Notificar la cancelación de forma accesible
    const statusElement = document.createElement('div');
    statusElement.setAttribute('role', 'status');
    statusElement.setAttribute('aria-live', 'assertive');
    statusElement.className = 'sr-only';
    statusElement.textContent = "Síntesis de voz cancelada";
    document.body.appendChild(statusElement);
    
    setTimeout(() => {
      document.body.removeChild(statusElement);
    }, 1000);
  }
}

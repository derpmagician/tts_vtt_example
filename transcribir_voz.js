// Referencias a elementos del DOM
const transcribeBtn = document.getElementById('transcribe-btn');
const stopTranscribeBtn = document.getElementById('stop-transcribe-btn');
const loadingElement = document.querySelector('.loading');
const commandsElement = document.getElementById('commands');

// Compatibilidad con diferentes navegadores para el API de reconocimiento de voz
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList

// Lista de colores disponibles para el reconocimiento de voz
var colors = [
  'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate',
  'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray',
  'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta',
  'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink',
  'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan',
  'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'
];

// Crear elementos visuales para cada color disponible
colors.forEach(color => {
  const colorSpan = document.createElement('span');
  colorSpan.textContent = color;
  colorSpan.style.backgroundColor = color;
  colorSpan.style.padding = '3px';
  colorSpan.style.margin = '3px';

  
  commandsElement.appendChild(colorSpan);
});

// Función para crear una gramática SRGS (Speech Recognition Grammar Specification)
function createSRGSGrammar(colors) {
  return `#JSGF V1.0;\ngrammar colors;\npublic <color> ${colors.map(c => c.toLowerCase()).join(' | ')};`;
}


function stopTranscription() {
  if (recognition) {
    recognition.stop();
    transcribeBtn.disabled = false;
    stopTranscribeBtn.disabled = true;
    loadingElement.style.display = 'none';
  }
}

// Función principal para convertir voz a texto
async function voiceToText() {
  try {
    // Configuración inicial de la interfaz
    transcribeBtn.disabled = true;
    stopTranscribeBtn.disabled = false;
    loadingElement.style.display = 'inline';

    // Configuración del reconocimiento de voz
    recognition = new SpeechRecognition ();
    recognition.continuous = true;      // Reconocimiento continuo
    recognition.interimResults = false; // Solo resultados finales
    recognition.maxAlternatives = 1;    // Una sola alternativa de reconocimiento

    // Manejador de errores
    recognition.onerror = function (event) {
      console.error('Recognition error:', event.error);
      // Restaurar estado de la interfaz
      transcribeBtn.disabled = false;
      stopTranscribeBtn.disabled = true;

      loadingElement.style.display = 'none';
    };

    // Eventos de inicio y fin del reconocimiento
    recognition.onstart = function () {
      console.log('Recognition started');
    };

    recognition.onend = function () {
      console.log('Recognition ended');
    };

    // Procesar resultados del reconocimiento
    recognition.onresult = function (event) {
      // Convertir resultados a texto
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('').toLowerCase();;

      // Mostrar el texto transcrito
      document.getElementById('output-text').value = transcript;
      // console.log(transcript);
      // Buscar si el texto coincide con algún color y cambiar el fondo
      const matchingColor = colors.find(color => color.toLowerCase().includes(transcript));

      if (matchingColor) {
        // Cambiamos el fondo del body al color coincidente
        document.body.style.backgroundColor = matchingColor;
      }
    };

    // Iniciar el reconocimiento
    recognition.start();
  } catch (err) {
    console.error(err);
    const transcribeBtn = document.getElementById('transcribe-btn');
    transcribeBtn.disabled = false;
  }
}
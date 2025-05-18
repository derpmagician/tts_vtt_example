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

// Mapeo de colores en español a inglés
const colorTranslations = {
  'agua': 'aqua',
  'azul': 'blue',
  'beige': 'beige',
  'bisque': 'bisque',
  'negro': 'black',
  'marrón': 'brown',
  'chocolate': 'chocolate',
  'coral': 'coral',
  'carmesí': 'crimson',
  'cian': 'cyan',
  'fucsia': 'fuchsia',
  'fantasma': 'ghostwhite',
  'dorado': 'gold',
  'gris': 'gray',
  'verde': 'green',
  'índigo': 'indigo',
  'marfil': 'ivory',
  'caqui': 'khaki',
  'lavanda': 'lavender',
  'lima': 'lime',
  'lino': 'linen',
  'magenta': 'magenta',
  'granate': 'maroon',
  'mocasín': 'moccasin',
  'marino': 'navy',
  'oliva': 'olive',
  'naranja': 'orange',
  'orquidea': 'orchid',
  'perú': 'peru',
  'rosa': 'pink',
  'ciruela': 'plum',
  'púrpura': 'purple',
  'rojo': 'red',
  'salmón': 'salmon',
  'siena': 'sienna',
  'plateado': 'silver',
  'nieve': 'snow',
  'bronceado': 'tan',
  'turquesa': 'turquoise',
  'violeta': 'violet',
  'blanco': 'white',
  'amarillo': 'yellow'
};

const colorTranslationsReversed = Object.fromEntries(
  Object.entries(colorTranslations).map(([key, value]) => [value, key])
);

// Lista de colores oscuros para aplicar texto blanco
const darkColors = ['black', 'indigo', 'maroon', 'navy', 'purple'];

// Crear elementos visuales para cada color disponible
Object.entries(colorTranslations).forEach(([spanish, english]) => {
  const colorSpan = document.createElement('span');
  colorSpan.textContent = `${spanish} (${english})`; // Muestra ambos nombres
  colorSpan.style.backgroundColor = english; // Usa el valor en inglés
  colorSpan.style.color = darkColors.includes(english) ? 'white' : 'black'; // Texto blanco en colores oscuros
  colorSpan.style.padding = '5px';
  colorSpan.style.margin = '5px';
  colorSpan.style.borderRadius = '3px';
  colorSpan.style.display = 'inline-block';
  
  // Agregar atributos ARIA
  colorSpan.setAttribute('role', 'listitem');
  colorSpan.setAttribute('aria-label', `Color ${spanish}, ${english}`);

  commandsElement.appendChild(colorSpan);
});

// Añadir comandos de tema
const themeCommands = [
  { command: 'tema oscuro', description: 'Activa el tema oscuro' },
  { command: 'tema claro', description: 'Activa el tema claro' }
];

// Separador entre colores y comandos
const separatorElement = document.createElement('div');
separatorElement.style.width = '100%';
separatorElement.style.height = '3px';
separatorElement.style.backgroundColor = 'var(--color-text-light)';
separatorElement.style.margin = '15px 0';
separatorElement.style.opacity = '0.7';
separatorElement.style.borderRadius = '1px';
separatorElement.setAttribute('aria-hidden', 'true');
commandsElement.appendChild(separatorElement);

// Título para los comandos de tema
const themeTitle = document.createElement('h3');
themeTitle.textContent = 'Comandos de tema:';
themeTitle.style.width = '100%';
themeTitle.style.marginTop = '10px';
themeTitle.style.color = 'var(--color-text-light)';
themeTitle.style.textShadow = '0px 0px 2px rgba(0, 0, 0, 0.2)';
themeTitle.style.fontWeight = '600';
commandsElement.appendChild(themeTitle);

// Crear elementos para los comandos de tema
themeCommands.forEach(({ command, description }) => {
  const themeCommandSpan = document.createElement('span');
  themeCommandSpan.textContent = `"${command}" - ${description}`;
  themeCommandSpan.style.padding = '5px';
  themeCommandSpan.style.margin = '5px';  themeCommandSpan.style.backgroundColor = 'var(--color-primary)';
  themeCommandSpan.style.color = 'var(--color-text-light)';
  themeCommandSpan.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
  themeCommandSpan.style.borderRadius = '3px';
  themeCommandSpan.style.display = 'inline-block';
  
  // Agregar atributos ARIA
  themeCommandSpan.setAttribute('role', 'listitem');
  themeCommandSpan.setAttribute('aria-label', `Comando de tema: ${command}, ${description}`);

  commandsElement.appendChild(themeCommandSpan);
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
    // Actualizar atributos ARIA
    transcribeBtn.setAttribute('aria-disabled', 'false');
    stopTranscribeBtn.setAttribute('aria-disabled', 'true');
    loadingElement.style.display = 'none';
    loadingElement.textContent = 'empiece a hablar';
    loadingElement.setAttribute('aria-live', 'off');
  }
}

// Función principal para convertir voz a texto
async function voiceToText() {
  try {
    // Configuración inicial de la interfaz
    transcribeBtn.disabled = true;
    stopTranscribeBtn.disabled = false;
    // Actualizar atributos ARIA
    transcribeBtn.setAttribute('aria-disabled', 'true');
    stopTranscribeBtn.setAttribute('aria-disabled', 'false');
    loadingElement.style.display = 'inline';
    loadingElement.textContent = 'escuchando... hable ahora';
    loadingElement.setAttribute('aria-live', 'assertive');

    // Configuración del reconocimiento de voz
    recognition = new SpeechRecognition ();
    recognition.continuous = true;      // Reconocimiento continuo
    recognition.interimResults = false; // Solo resultados finales
    recognition.maxAlternatives = 1;    // Una sola alternativa de reconocimiento    // Manejador de errores
    recognition.onerror = function (event) {
      console.error('Recognition error:', event.error);
      // Restaurar estado de la interfaz
      transcribeBtn.disabled = false;
      stopTranscribeBtn.disabled = true;
      // Actualizar atributos ARIA
      transcribeBtn.setAttribute('aria-disabled', 'false');
      stopTranscribeBtn.setAttribute('aria-disabled', 'true');
      
      loadingElement.style.display = 'none';
      loadingElement.textContent = 'Error en reconocimiento de voz';
      loadingElement.setAttribute('aria-live', 'assertive');
    };

    // Eventos de inicio y fin del reconocimiento
    recognition.onstart = function () {
      console.log('Recognition started');
    };

    recognition.onend = function () {
      console.log('Recognition ended');
    };    // Procesar resultados del reconocimiento
    recognition.onresult = function (event) {
      // Convertir resultados a texto
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('').toLowerCase();

      // Mostrar el texto transcrito
      const outputText = document.getElementById('output-text');
      outputText.value = transcript;
      // Actualizar atributos ARIA para anunciar el texto transcrito
      outputText.setAttribute('aria-label', 'Texto transcrito: ' + transcript);
        // Verificar si es un comando de tema
      if (transcript.includes('tema oscuro') || transcript.includes('modo oscuro')) {
        setTheme('dark');
        const themeAnnouncement = document.createElement('div');
        themeAnnouncement.setAttribute('role', 'status');
        themeAnnouncement.textContent = `Tema oscuro activado por comando de voz`;
        document.body.appendChild(themeAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(themeAnnouncement);
        }, 3000);
        
        return;
      } else if (transcript.includes('tema claro') || transcript.includes('modo claro')) {
        setTheme('light');
        const themeAnnouncement = document.createElement('div');
        themeAnnouncement.setAttribute('role', 'status');
        themeAnnouncement.textContent = `Tema claro activado por comando de voz`;
        document.body.appendChild(themeAnnouncement);
        
        setTimeout(() => {
          document.body.removeChild(themeAnnouncement);
        }, 3000);
        
        return;
      }
      
      // Buscar si el texto coincide con algún color y cambiar el fondo
      let matchingColor = colorTranslations[transcript];
      let colorName = transcript;

      // Si no se encuentra en español, buscar en inglés
      if (!matchingColor) {
        matchingColor = colors.find(color => color.toLowerCase() === transcript);
        // Si encontramos el color en inglés, buscar su nombre en español
        if (matchingColor) {
          colorName = colorTranslationsReversed[matchingColor] || transcript;
        }
      }

      if (matchingColor) {
        // Cambiamos el fondo del body al color coincidente
        document.body.style.backgroundColor = matchingColor;
        // Anunciar el cambio de color para lectores de pantalla
        const colorAlert = document.createElement('div');
        colorAlert.setAttribute('role', 'status');
        colorAlert.setAttribute('aria-live', 'polite');
        colorAlert.className = 'sr-only'; // Clase para ocultar visualmente pero mantener accesible
        colorAlert.textContent = `Cambiando color de fondo a ${colorName}`;
        document.body.appendChild(colorAlert);
        
        // Eliminar el anuncio después de que haya sido leído
        setTimeout(() => {
          document.body.removeChild(colorAlert);
        }, 3000);
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
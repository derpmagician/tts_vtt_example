const transcribeBtn = document.getElementById('transcribe-btn');
const stopTranscribeBtn = document.getElementById('stop-transcribe-btn');
const loadingElement = document.querySelector('.loading');
const commandsElement = document.getElementById('commands');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList

var colors = [
  'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate',
  'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray',
  'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta',
  'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink',
  'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan',
  'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'
];


colors.forEach(color => {
  const colorSpan = document.createElement('span');
  colorSpan.textContent = color;
  colorSpan.style.backgroundColor = color;
  colorSpan.style.padding = '3px';
  colorSpan.style.margin = '3px';

  
  commandsElement.appendChild(colorSpan);
});

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

// Función para convertir voz a texto
async function voiceToText() {
  try {
    // Desactiva el botón de transcripción
    transcribeBtn.disabled = true;
    stopTranscribeBtn.disabled = false;
    loadingElement.style.display = 'inline';

    recognition = new SpeechRecognition ();
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
    };

    recognition.onresult = function (event) {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('').toLowerCase();;

      document.getElementById('output-text').value = transcript;
      // console.log(transcript);
      const matchingColor = colors.find(color => color.toLowerCase().includes(transcript));

      if (matchingColor) {
        // Cambiamos el fondo del body al color coincidente
        document.body.style.backgroundColor = matchingColor;
      }
    };

    recognition.start();
  } catch (err) {
    console.error(err);
    const transcribeBtn = document.getElementById('transcribe-btn');
    transcribeBtn.disabled = false;
  }
}
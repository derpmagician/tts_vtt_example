# Text-to-Speech y Reconocimiento Facial

Este proyecto es una aplicación web que combina varias tecnologías de interacción:

1. Texto a Voz (Text-to-Speech)
2. Reconocimiento de Voz (Speech-to-Text)
3. Detección Facial con análisis de edad, género y expresiones

## Características

### Texto a Voz (voz-script.js)
- Convierte texto escrito a voz utilizando la API Web Speech
- Soporta múltiples voces en español
- Permite ajustar volumen, velocidad y tono de la voz

### Reconocimiento de Voz (transcribir_voz.js)
- Transcribe voz a texto en tiempo real
- Incluye reconocimiento de colores con cambio dinámico del fondo
- Interfaz visual para mostrar los colores disponibles
- Sistema de gramática SRGS para mejorar el reconocimiento

### Detección Facial (cara-script.js)
- Detección facial en tiempo real usando face-api.js
- Análisis de características faciales:
  - Edad aproximada
  - Género
  - Expresiones faciales
  - Puntos de referencia facial
- Visualización en tiempo real sobre un canvas

## APIs Utilizadas

### Web Speech API
- **SpeechSynthesis (Text-to-Speech)**
  - Implementada en `voz-script.js`
  - Utiliza `window.speechSynthesis` para la síntesis de voz
  - Permite seleccionar voces en español del sistema
  - Configuración de parámetros:
    - Volumen
    - Velocidad
    - Tono

- **SpeechRecognition (Speech-to-Text)**
  - Implementada en `transcribir_voz.js`
  - Utiliza `SpeechRecognition` o `webkitSpeechRecognition`
  - Incluye gramática SRGS (Speech Recognition Grammar Specification)
  - Reconocimiento continuo en español
  - Detección de comandos de color en tiempo real

### Face-API.js
- Implementada en `cara-script.js`
- Biblioteca basada en TensorFlow.js para detección facial
- Modelos utilizados:
  - Detección facial (face-detection)
  - Reconocimiento de edad y género
  - Detección de expresiones faciales
  - Puntos de referencia facial (landmarks)
- Carga modelos desde directorio local o GitHub Pages
- Procesamiento en tiempo real mediante canvas

## Requisitos de APIs

### Web Speech API
- Requiere navegador compatible con Web Speech API
- No necesita clave de API
- Funciona offline una vez cargadas las voces
- Mejor soporte en Chrome y Edge

### Face-API.js
- Requiere navegador con soporte WebGL
- No necesita clave de API
- Modelos se cargan desde el servidor local o CDN
- Requiere acceso a la cámara web (getUserMedia API)

## Requisitos Técnicos
- Navegador moderno con soporte para:
  - WebRTC (para acceso a la cámara)
  - Web Speech API
  - Canvas API
- Conexión a internet para cargar los modelos de detección facial

## Uso
1. Para el Text-to-Speech:
   - Escriba texto en el campo de entrada
   - Seleccione una voz en español
   - Presione el botón para escuchar el texto

2. Para el Speech-to-Text:
   - Presione el botón de transcripción
   - Hable claramente
   - El texto aparecerá en el campo de salida
   - Diga un color para cambiar el fondo
   - Diga "tema oscuro" o "tema claro" para cambiar el tema

3. Para la Detección Facial:
   - Permita el acceso a la cámara
   - Posiciónese frente a la cámara
   - Las detecciones se mostrarán automáticamente

## Notas
- La detección facial puede variar según la calidad de la cámara y la iluminación
- El reconocimiento de voz funciona mejor en ambientes silenciosos
- Las voces disponibles dependerán del sistema operativo y navegador utilizado
- El sistema cuenta con tema claro y oscuro, que se puede cambiar mediante el botón en la parte superior o por comandos de voz

## Características de Accesibilidad
- Roles ARIA implementados para mejorar la lectura por lectores de pantalla
- Tema oscuro para reducir la fatiga visual
- Anuncios de estado para informar sobre cambios en la aplicación
- Navegación completa por teclado
- Alto contraste en textos e interfaces


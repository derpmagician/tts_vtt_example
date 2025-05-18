// Script para alternar entre temas claro y oscuro

// Función para establecer el tema
function setTheme(themeName) {
  // Verificar si estamos cambiando al tema oscuro
  const isDarkTheme = themeName === 'dark';
  
  // Aplicar o quitar la clase 'dark-theme' al elemento html
  if (isDarkTheme) {
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
  }
  
  // Guardar la preferencia del usuario
  localStorage.setItem('preferred-theme', themeName);
  
  // Anunciar el cambio para lectores de pantalla
  const themeAnnouncement = document.createElement('div');
  themeAnnouncement.setAttribute('role', 'status');
  themeAnnouncement.setAttribute('aria-live', 'polite');
  themeAnnouncement.className = 'sr-only';
  themeAnnouncement.textContent = isDarkTheme ? 
    'Tema oscuro activado' : 
    'Tema claro activado';
  document.body.appendChild(themeAnnouncement);
  
  setTimeout(() => {
    document.body.removeChild(themeAnnouncement);
  }, 2000);
}

// Función para alternar entre temas
function toggleTheme() {
  if (document.documentElement.classList.contains('dark-theme')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

// Función para inicializar el tema según la preferencia guardada o la preferencia del sistema
function initTheme() {
  // Verificar si hay preferencia guardada
  const savedTheme = localStorage.getItem('preferred-theme');
  
  if (savedTheme) {
    // Usar la preferencia guardada
    setTheme(savedTheme);
  } else {
    // Usar la preferencia del sistema si está disponible
    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDarkTheme ? 'dark' : 'light');
  }
}

// Inicializar el tema cuando se carga el documento
document.addEventListener('DOMContentLoaded', initTheme);

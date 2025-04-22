document.addEventListener('DOMContentLoaded', () => {
  // Restaurar el estado del plugin desde chrome.storage
  chrome.storage.local.get(['pluginEnabled'], function (result) {
    const isEnabled = result.pluginEnabled !== false;  // Si no está guardado, será 'true' por defecto
    pluginToggle.checked = isEnabled;  // Sincroniza el estado del switch con el almacenamiento local
    if (!isEnabled) {
      overlay.classList.remove('hidden');  // Si está desactivado, muestra el overlay
    }
  });

  checkPageSafety();  // Lanza el análisis de la página cuando se abre el popup
});

function checkPageSafety() {
  // COSA FALTANTE ACA, JUAN HAZ TU MAGIA: 
  // Aquí iría la lógica real para verificar si la página es segura, por ahora lo dejamos vacío
  showGreenScreen(); // Temporario: siempre muestra que es segura, ESTO VA CAMBIAR, POR AHORA QUEDA ASI
}

function showGreenScreen() {
  document.getElementById('greenScreen').style.display = 'block';
  document.getElementById('redScreen').style.display = 'none';
}

function showRedScreen() {
  document.getElementById('redScreen').style.display = 'block';
  document.getElementById('greenScreen').style.display = 'none';
}

const pluginToggle = document.getElementById('pluginToggle');
const overlay = document.getElementById('disabledOverlay');

// Guardar el estado del plugin
pluginToggle.addEventListener('change', function () {
  const isEnabled = this.checked;
  chrome.storage.local.set({ pluginEnabled: isEnabled }, function () {
    if (isEnabled) {
      overlay.classList.add('hidden');  // Oculta el overlay si está activado
    } else {
      overlay.classList.remove('hidden');  // Muestra el overlay si está desactivado
    }
  });
});

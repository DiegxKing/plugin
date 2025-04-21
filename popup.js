document.addEventListener('DOMContentLoaded', () => {
  checkPageSafety(); // Lanza análisis apenas se abre el popup
});

function checkPageSafety() {
  const isSafe = Math.random() > 0.5; // Simulación: 50% segura

  if (isSafe) {
    showGreenScreen();
  } else {
    showRedScreen();
  }
}

function showGreenScreen() {
  document.getElementById('greenScreen').style.display = 'block';
  document.getElementById('redScreen').style.display = 'none';
}

function showRedScreen() {
  document.getElementById('redScreen').style.display = 'block';
  document.getElementById('greenScreen').style.display = 'none';
}

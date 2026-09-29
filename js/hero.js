// El video decora la portada; nunca debe impedir leerla ni obligar a verlo.
(() => {
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-video-toggle');
  if (!video || !toggle) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByVisitor = false;
  const arrivalStart = 5;
  const arrivalEnd = 10.5;

  function updateControl() {
    const paused = video.paused;
    toggle.textContent = paused ? 'Reproducir video' : 'Pausar video';
    toggle.setAttribute('aria-label', paused ? 'Reproducir video de fondo' : 'Pausar video de fondo');
  }

  function playVideo() {
    video.play().then(updateControl).catch(() => {
      // La imagen de fondo sigue visible si el navegador bloquea la reproducción.
      toggle.hidden = true;
    });
  }

  // La toma empieza con la pista vacía; repetimos solo la llegada del avión.
  video.addEventListener('loadedmetadata', () => {
    video.currentTime = arrivalStart;
    if (!reducedMotion.matches && !pausedByVisitor) playVideo();
  });
  video.addEventListener('timeupdate', () => {
    if (video.currentTime >= arrivalEnd) video.currentTime = arrivalStart;
  });
  video.addEventListener('error', () => {
    toggle.hidden = true;
  });

  function syncMotionPreference() {
    if (reducedMotion.matches) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      toggle.hidden = true;
      return;
    }

    if (!video.getAttribute('src')) {
      video.src = video.dataset.src;
      video.load();
    } else if (!pausedByVisitor) {
      playVideo();
    }
    toggle.hidden = false;
    if (pausedByVisitor) updateControl();
  }

  toggle.addEventListener('click', () => {
    pausedByVisitor = !video.paused;
    if (pausedByVisitor) {
      video.pause();
      updateControl();
    } else {
      playVideo();
    }
  });

  reducedMotion.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
})();

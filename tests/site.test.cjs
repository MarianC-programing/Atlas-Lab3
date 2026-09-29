const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('la portada ofrece video accesible con respaldo, control y crédito', () => {
  const html = read('index.html');
  assert.match(html, /<video\b[^>]*id="hero-video"[^>]*muted[^>]*playsinline[^>]*poster="img\/atlas-avion\.png"/);
  assert.match(html, /data-src="video\/avion-aterrizando-pexels-10406880\.mp4"/);
  assert.match(html, /<button\b[^>]*id="hero-video-toggle"/);
  assert.match(html, /<script\b[^>]*src="js\/hero\.js"/);
  assert.match(html, /pexels\.com\/video\/airplane-landing-over-cars-10406880/);
});

test('el clip local es MP4 y pesa menos de 2,5 MB', () => {
  const clip = fs.readFileSync(path.join(root, 'video/avion-aterrizando-pexels-10406880.mp4'));
  assert.equal(clip.toString('ascii', 4, 8), 'ftyp');
  assert.ok(clip.length > 100_000 && clip.length < 2_500_000, `peso: ${clip.length}`);
});

test('las imágenes y scripts locales de las tres páginas existen', () => {
  for (const page of ['index.html', 'destinos.html', 'reservas.html']) {
    const html = read(page);
    for (const [, asset] of html.matchAll(/\b(?:src|poster)="([^"]+)"/g)) {
      if (/^(?:https?:|data:)/.test(asset)) continue;
      assert.ok(fs.existsSync(path.join(root, asset)), `${page}: no existe ${asset}`);
    }
  }
});

test('la guía permite escoger estilo de viaje y preparar la salida', () => {
  const html = read('index.html');
  for (const id of ['cultura', 'naturaleza', 'ciudad']) {
    assert.match(html, new RegExp(`id="ruta-${id}"`));
  }
  for (const id of ['kioto', 'marrakech', 'cusco', 'reikiavik', 'lisboa']) {
    assert.match(html, new RegExp(`href="destinos\\.html#${id}"`));
  }
  assert.match(html, /<section\b[^>]*id="antes-de-despegar"/);
  assert.equal((html.match(/<details\b/g) || []).length >= 4, true);
});

test('las cinco fichas añaden orientación didáctica y fuente oficial', () => {
  const html = read('destinos.html');
  const expected = [
    ['kioto', 'kyoto.travel'],
    ['marrakech', 'visitmorocco.com'],
    ['cusco', 'peru.travel'],
    ['reikiavik', 'visiticeland.com'],
    ['lisboa', 'visitlisboa.com'],
  ];
  for (const [id, domain] of expected) {
    const section = html.match(new RegExp(`<article class="destino-detalle" id="${id}">([\\s\\S]*?)<\\/article>`));
    assert.ok(section, `falta ficha ${id}`);
    assert.match(section[1], /class="micro-ruta"/, `falta micro-ruta de ${id}`);
    assert.match(section[1], /class="nota-practica"/, `falta nota práctica de ${id}`);
    assert.ok(section[1].includes(domain), `falta fuente oficial de ${id}`);
  }
});

test('Marrakech distingue el cercano Agafay del Sáhara lejano en ambas páginas', () => {
  const home = read('index.html');
  const destinations = read('destinos.html');
  assert.match(home, /Agafay/);
  assert.match(destinations, /Agafay/);
  assert.doesNotMatch(destinations, /[Aa] dos o tres horas está el borde del Sahara/);
});

test('el control pausa el clip y la preferencia de menos movimiento evita cargarlo', async () => {
  function setup(reduced) {
    const video = {
      attrs: {}, dataset: { src: 'video/avion-aterrizando-pexels-10406880.mp4' }, paused: true,
      currentTime: 0, readyState: 0, listeners: {},
      getAttribute(name) { return this.attrs[name] || null; },
      removeAttribute(name) { delete this.attrs[name]; },
      set src(value) { this.attrs.src = value; },
      addEventListener(name, listener) { this.listeners[name] = listener; },
      load() { if (this.getAttribute('src')) { this.readyState = 1; this.listeners.loadedmetadata?.(); } },
      play() { this.paused = false; return Promise.resolve(); },
      pause() { this.paused = true; },
    };
    const toggle = {
      hidden: true, textContent: '', listeners: {}, attrs: {},
      addEventListener(name, listener) { this.listeners[name] = listener; },
      setAttribute(name, value) { this.attrs[name] = value; },
    };
    const media = {
      matches: reduced, listeners: {},
      addEventListener(name, listener) { this.listeners[name] = listener; },
    };
    vm.runInNewContext(read('js/hero.js'), {
      document: { getElementById: (id) => id === 'hero-video' ? video : toggle },
      window: { matchMedia: () => media },
    });
    return { video, toggle, media };
  }

  const still = setup(true);
  assert.equal(still.video.getAttribute('src'), null);
  assert.equal(still.toggle.hidden, true);

  const moving = setup(false);
  await Promise.resolve();
  assert.equal(moving.video.getAttribute('src'), moving.video.dataset.src);
  assert.ok(moving.video.currentTime >= 4, 'la llegada comienza sin esperar la pista vacía');
  assert.equal(moving.video.paused, false);
  assert.equal(moving.toggle.hidden, false);
  moving.toggle.listeners.click();
  assert.equal(moving.video.paused, true);
  assert.equal(moving.toggle.textContent, 'Reproducir video');
  moving.toggle.listeners.click();
  await Promise.resolve();
  assert.equal(moving.video.paused, false);
  moving.video.currentTime = 11;
  moving.video.listeners.timeupdate();
  assert.ok(moving.video.currentTime < 10, 'el segmento de llegada vuelve a empezar');
  moving.media.matches = true;
  moving.media.listeners.change();
  assert.equal(moving.video.getAttribute('src'), null);
  assert.equal(moving.toggle.hidden, true);
});

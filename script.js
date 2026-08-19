// =========================================================
// 1. TU LISTA DE WALLPAPERS (Edita esto para agregar más)
// =========================================================
// He dejado sólo las imágenes que están en el repo actualmente. Si agregas más
// archivos en /wallpapers/<carpeta>/archivo.ext, añade objetos aquí.
const miGaleria = [
    { carpeta: "linux", archivo: "Wallp001.png" }
];

// =========================================================
// 2. LÓGICA DEL SITIO (Defensiva y robusta)
// =========================================================

// Guardas defensivas: sólo enganchar listeners si los elementos existen
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
  });
}

// navegación lateral — sólo si hay botones
const navButtons = document.querySelectorAll('.nav-btn') || [];
const sections = document.querySelectorAll('.section') || [];
if (navButtons.length && sections.length) {
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-section');
      if (target && document.getElementById(target)) {
        document.getElementById(target).classList.add('active');
      }
    });
  });
}

// --- GENERAR WALLPAPERS Y BOTONES ---
const filterContainer = document.getElementById('filterContainer');
const wallpapersGrid = document.getElementById('wallpapersGrid');

function inicializarWallpapers() {
  if (!filterContainer || !wallpapersGrid) return;

  // 1. Obtener las carpetas únicas para hacer los botones
  const carpetas = Array.from(new Set(miGaleria.map(item => item.carpeta)));

  // Botón "Todos"
  filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';

  // Crear botones para cada subcarpeta
  carpetas.forEach(carpeta => {
    filterContainer.innerHTML += `<button class="filter-btn" data-filter="${carpeta}">${carpeta}</button>`;
  });

  // 2. Lógica para filtrar al hacer clic en los botones
  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderizarGaleria(btn.getAttribute('data-filter'));
    });
  });

  // 3. Mostrar todos al iniciar
  renderizarGaleria('all');
}

function renderizarGaleria(filtro) {
  if (!wallpapersGrid) return;
  wallpapersGrid.innerHTML = ''; // Limpiar grid

  miGaleria.forEach(item => {
    if (filtro === 'all' || filtro === item.carpeta) {
      const ruta = `wallpapers/${item.carpeta}/${item.archivo}`;
      const card = document.createElement('div');
      card.className = 'wallpaper-card';

      // Imagen con fallback si no existe
      const img = document.createElement('img');
      img.src = ruta;
      img.alt = item.archivo;
      img.className = 'aberrate';
      img.onerror = function() {
        // Si falla la carga, mostrar un placeholder SVG pequeño
        this.onerror = null;
        this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="%23111"/><text x="50%" y="50%" fill="%23aaa" font-size="20" text-anchor="middle" dy="7">Imagen no disponible</text></svg>';
      };

      card.appendChild(img);

      // Abrir modal al hacer clic
      card.addEventListener('click', () => abrirModal(item.carpeta, item.archivo, ruta));

      wallpapersGrid.appendChild(card);
    }
  });
}

// --- MODAL Y DESCARGAS ---
const modal = document.getElementById('wallpaperModal');
const modalClose = document.getElementById('modalClose');

function abrirModal(carpeta, archivo, ruta) {
  if (!modal) return;
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDetails = document.getElementById('modalDetails');
  const downloadBtn = document.getElementById('downloadBtn');

  if (modalImage) modalImage.src = ruta;
  if (modalTitle) modalTitle.textContent = archivo;
  if (modalDetails) modalDetails.innerHTML = `Carpeta: <b>${carpeta}</b>`;
  if (downloadBtn) { downloadBtn.href = ruta; downloadBtn.download = archivo; }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

if (modalClose) modalClose.addEventListener('click', () => { modal.classList.remove('active'); modal.setAttribute('aria-hidden', 'true'); });
window.addEventListener('click', (e) => {
  if (modal && e.target === modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
});

// Arrancar el sistema de wallpapers al cargar la página
inicializarWallpapers();

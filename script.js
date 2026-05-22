// =========================================================
// 1. TU LISTA DE WALLPAPERS (Edita esto para agregar más)
// =========================================================
// 'carpeta' es el nombre de tu subcarpeta.
// 'archivo' es el nombre de la imagen con su extensión.
const miGaleria = [
    { carpeta: "otros", archivo: "wallp002.png" },
    { carpeta: "juegos", archivo: "zelda.png" },
    { carpeta: "arte", archivo: "dibujo.jpg" },
    { carpeta: "espacio", archivo: "planeta.png" }
];

// =========================================================
// 2. LÓGICA DEL SITIO (No necesitas tocar esto)
// =========================================================

// --- TEMA CLARO / OSCURO ---
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// --- NAVEGACIÓN LATERAL ---
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar activo a todos
        navButtons.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Poner activo al presionado
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-section')).classList.add('active');
    });
});

// --- GENERAR WALLPAPERS Y BOTONES ---
const filterContainer = document.getElementById('filterContainer');
const wallpapersGrid = document.getElementById('wallpapersGrid');

function inicializarWallpapers() {
    // 1. Obtener las carpetas únicas para hacer los botones
    const carpetas = new Set(miGaleria.map(item => item.carpeta));
    
    // Botón "Todos"
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';
    
    // Crear botones para cada subcarpeta
    carpetas.forEach(carpeta => {
        filterContainer.innerHTML += `<button class="filter-btn" data-filter="${carpeta}">${carpeta}</button>`;
    });

    // 2. Lógica para filtrar al hacer clic en los botones
    const filterBtns = document.querySelectorAll('.filter-btn');
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
    wallpapersGrid.innerHTML = ''; // Limpiar grid

    miGaleria.forEach(item => {
        if (filtro === 'all' || filtro === item.carpeta) {
            const ruta = `wallpapers/${item.carpeta}/${item.archivo}`;
            const card = document.createElement('div');
            card.className = 'wallpaper-card';
            card.innerHTML = `<img src="${ruta}" alt="${item.archivo}">`;
            
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
    document.getElementById('modalImage').src = ruta;
    document.getElementById('modalTitle').textContent = archivo;
    document.getElementById('modalDetails').innerHTML = `Carpeta: <b>${carpeta}</b>`;
    
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.href = ruta;
    downloadBtn.download = archivo; // Forzar descarga con el nombre original
    
    modal.classList.add('active');
}

modalClose.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});

// Arrancar el sistema de wallpapers al cargar la página
inicializarWallpapers();

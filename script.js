// ==================== CONFIGURACIÓN ====================
const WALLPAPERS_DIR = 'wallpapers/';
const WALLPAPER_CATEGORIES = ['godot', 'linux', 'minimal'];

// ==================== ELEMENTOS DEL DOM ====================
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const filterButtons = document.querySelectorAll('.filter-btn');
const wallpapersGrid = document.getElementById('wallpapersGrid');
const modal = document.getElementById('wallpaperModal');
const closeBtn = document.querySelector('.close');
const downloadBtn = document.getElementById('downloadBtn');

let allWallpapers = [];
let currentFilter = 'all';

// ==================== NAVEGACIÓN ====================
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionId = btn.getAttribute('data-section');
        
        // Actualizar botones activos
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Mostrar sección
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    });
});

// ==================== CARGA DE WALLPAPERS ====================
async function loadWallpapers() {
    allWallpapers = [];
    
    for (const category of WALLPAPER_CATEGORIES) {
        try {
            // Intenta cargar el directorio
            const response = await fetch(`${WALLPAPERS_DIR}${category}/`);
            
            if (!response.ok) continue;
            
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            // Busca archivos .webp en la respuesta
            const links = Array.from(doc.querySelectorAll('a'));
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.endsWith('.webp')) {
                    allWallpapers.push({
                        category: category,
                        filename: href,
                        path: `${WALLPAPERS_DIR}${category}/${href}`,
                        title: href.replace('.webp', '').toUpperCase()
                    });
                }
            });
        } catch (error) {
            console.log(`Directorio ${category} no encontrado o vacío`);
        }
    }
    
    renderWallpapers('all');
}

// ==================== RENDERIZAR WALLPAPERS ====================
function renderWallpapers(filter) {
    currentFilter = filter;
    wallpapersGrid.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? allWallpapers 
        : allWallpapers.filter(w => w.category === filter);
    
    filtered.forEach(wallpaper => {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        card.setAttribute('data-filter', wallpaper.category);
        
        card.innerHTML = `
            <img src="${wallpaper.path}" alt="${wallpaper.title}" loading="lazy">
            <div class="wallpaper-overlay">
                <div class="wallpaper-name">${wallpaper.title}</div>
            </div>
        `;
        
        card.addEventListener('click', () => openModal(wallpaper));
        wallpapersGrid.appendChild(card);
    });
}

// ==================== FILTROS ====================
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        renderWallpapers(filter);
    });
});

// ==================== MODAL ====================
function openModal(wallpaper) {
    const modal = document.getElementById('wallpaperModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const downloadBtn = document.getElementById('downloadBtn');
    
    modalImage.src = wallpaper.path;
    modalTitle.textContent = wallpaper.title;
    
    const fileSize = 'Tamaño: ~2-3 MB'; // Ajusta según tus archivos
    modalDetails.innerHTML = `
        <strong>Archivo:</strong> ${wallpaper.filename}<br>
        <strong>Categoría:</strong> ${wallpaper.category.toUpperCase()}<br>
        <strong>Resolución:</strong> Recomendado 1080p+<br>
        ${fileSize}
    `;
    
    downloadBtn.href = wallpaper.path;
    downloadBtn.download = wallpaper.filename;
    
    modal.classList.add('active');
}

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// ==================== INICIALIZAR ====================
document.addEventListener('DOMContentLoaded', () => {
    loadWallpapers();
});

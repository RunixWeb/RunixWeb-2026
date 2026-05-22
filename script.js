// ==================== CONFIGURACIÓN ====================
const WALLPAPERS_DIR = 'wallpapers/';
const WALLPAPER_CATEGORIES = ['godot', 'linux', 'minimal'];

// ==================== ELEMENTOS DEL DOM ====================
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const filterButtons = document.querySelectorAll('.filter-btn');
const wallpapersGrid = document.getElementById('wallpapersGrid');
const modal = document.getElementById('wallpaperModal');
const modalClose = document.getElementById('modalClose');
const downloadBtn = document.getElementById('downloadBtn');
const themeToggle = document.getElementById('themeToggle');

let allWallpapers = [];
let currentFilter = 'all';
let isDarkMode = true;

// ==================== NAVEGACIÓN ====================
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionId = btn.getAttribute('data-section');
        
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    });
});

// ==================== TEMA CLARO/OSCURO ====================
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = isDarkMode ? '🌙' : '☀️';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Cargar tema guardado
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        isDarkMode = false;
        document.body.classList.add('light-mode');
        themeToggle.textContent = '☀️';
    } else {
        isDarkMode = true;
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '🌙';
    }
}

// ==================== CARGA DE WALLPAPERS ====================
async function loadWallpapers() {
    allWallpapers = [];
    
    for (const category of WALLPAPER_CATEGORIES) {
        try {
            const response = await fetch(`${WALLPAPERS_DIR}${category}/`);
            
            if (!response.ok) continue;
            
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            const links = Array.from(doc.querySelectorAll('a'));
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.endsWith('.webp')) {
                    allWallpapers.push({
                        category: category,
                        filename: href,
                        path: `${WALLPAPERS_DIR}${category}/${href}`,
                        title: href.replace('.webp', '').replace(/[-_]/g, ' ').toUpperCase()
                    });
                }
            });
        } catch (error) {
            console.log(`Directorio ${category} no encontrado`);
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
    
    if (filtered.length === 0) {
        wallpapersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No hay wallpapers en esta categoría</p>';
        return;
    }
    
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
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    
    modalImage.src = wallpaper.path;
    modalTitle.textContent = wallpaper.title;
    
    modalDetails.innerHTML = `
        <strong>Archivo:</strong> ${wallpaper.filename}<br>
        <strong>Categoría:</strong> ${wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1)}<br>
        <strong>Formato:</strong> WebP
    `;
    
    downloadBtn.href = wallpaper.path;
    downloadBtn.download = wallpaper.filename;
    
    modal.classList.add('active');
}

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// ==================== INICIALIZAR ====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadWallpapers();
});
// ==================== ELEMENTOS DEL DOM ====================
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const filterContainer = document.getElementById('filterContainer');
const wallpapersGrid = document.getElementById('wallpapersGrid');
const modal = document.getElementById('wallpaperModal');
const modalClose = document.getElementById('modalClose');
const downloadBtn = document.getElementById('downloadBtn');

let allWallpapers = [];
let currentFilter = 'all';
let categories = new Set();

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

// ==================== CARGA AUTOMÁTICA DE WALLPAPERS ====================
async function loadWallpapers() {
    allWallpapers = [];
    categories.clear();
    
    try {
        // Buscar la carpeta wallpapers
        const response = await fetch('wallpapers/');
        
        if (!response.ok) {
            wallpapersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Carpeta wallpapers no encontrada</p>';
            return;
        }

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // Obtener todas las subcarpetas
        const links = Array.from(doc.querySelectorAll('a'));
        const folders = links
            .map(link => link.getAttribute('href'))
            .filter(href => href && href !== '../' && href.endsWith('/'))
            .map(href => href.slice(0, -1));

        // Cargar imágenes de cada subcarpeta
        for (const folder of folders) {
            await loadWallpapersFromFolder(folder);
        }

        // Crear botones de filtro dinámicos
        createFilterButtons();
        renderWallpapers('all');

    } catch (error) {
        console.error('Error cargando wallpapers:', error);
        wallpapersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Error cargando wallpapers</p>';
    }
}

// ==================== CARGAR WALLPAPERS DE CARPETA ====================
async function loadWallpapersFromFolder(folder) {
    try {
        const response = await fetch(`wallpapers/${folder}/`);
        
        if (!response.ok) return;

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        const links = Array.from(doc.querySelectorAll('a'));
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '../') {
                const isImage = imageExtensions.some(ext => href.toLowerCase().endsWith(ext));
                
                if (isImage) {
                    categories.add(folder);
                    allWallpapers.push({
                        category: folder,
                        filename: href,
                        path: `wallpapers/${folder}/${href}`,
                        title: href.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').toUpperCase()
                    });
                }
            }
        });
    } catch (error) {
        console.log(`Carpeta ${folder} no encontrada`);
    }
}

// ==================== CREAR FILTROS DINÁMICOS ====================
function createFilterButtons() {
    filterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">Todos</button>';
    
    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.setAttribute('data-filter', category);
        btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterContainer.appendChild(btn);
    });

    // Agregar listeners a nuevos botones
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            renderWallpapers(filter);
        });
    });
}

// ==================== RENDERIZAR WALLPAPERS ====================
function renderWallpapers(filter) {
    currentFilter = filter;
    wallpapersGrid.innerHTML = '';
    
    const filtered = filter === 'all' 
        ? allWallpapers 
        : allWallpapers.filter(w => w.category === filter);
    
    if (filtered.length === 0) {
        wallpapersGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay wallpapers</p>';
        return;
    }
    
    filtered.forEach(wallpaper => {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        
        card.innerHTML = `<img src="${wallpaper.path}" alt="${wallpaper.title}" loading="lazy">`;
        
        card.addEventListener('click', () => openModal(wallpaper));
        wallpapersGrid.appendChild(card);
    });
}

// ==================== MODAL ====================
function openModal(wallpaper) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    
    modalImage.src = wallpaper.path;
    modalTitle.textContent = wallpaper.title;
    
    modalDetails.innerHTML = `<strong>Archivo:</strong> ${wallpaper.filename}<br><strong>Categoría:</strong> ${wallpaper.category.charAt(0).toUpperCase() + wallpaper.category.slice(1)}`;
    
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
    loadWallpapers();
});

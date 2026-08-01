// app.js — pequeño comportamiento para los botones de enlaces externos
// Los botones usan el atributo data-link. Reemplaza las URLs con las tuyas.

document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.external-link').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const url = btn.getAttribute('data-link');
      if(!url) return;
      // Abrir en nueva pestaña
      window.open(url, '_blank', 'noopener');
    });
  });

  // Navegación interna básica (solo desplaza a secciones)
  const navMap = {
    'btn-home':'hero',
    'btn-about':'description',
    'btn-contact':'small-module'
  };
  Object.entries(navMap).forEach(([btnId, sectionId])=>{
    const btn = document.getElementById(btnId);
    const sec = document.getElementById(sectionId);
    if(btn && sec){
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        sec.scrollIntoView({behavior:'smooth'});
      });
    }
  });
});

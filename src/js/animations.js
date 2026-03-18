document.addEventListener("DOMContentLoaded", () => {
  // Animar el Hero (Sección 1) inmediatamente al cargar la página
  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      "#s1 .header-text h1, #s1 .header-text h2",
      { opacity: 0, y: 30 },
      { duration: 1, opacity: 1, y: 0, stagger: 0.2, ease: "power2.out", delay: 0.2 }
    );
  
    // Elementos a animar al hacer scroll (secciones 2 en adelante)
    const scrollElements = document.querySelectorAll(
      "section h3, section p, section figure, section > img"
    );
  
    // Estado inicial: transparentes y desplazados 40px hacia abajo
    gsap.set(scrollElements, { opacity: 0, y: 40 });
  
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1 // Se dispara cuando el 10% del elemento es visible
    };
  
    let intersectingElements = [];
    let batchTimeout = null;
  
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Añadimos el elemento a la cola de animación
          intersectingElements.push(entry.target);
          // Dejamos de observarlo para que la animación ocurra solo una vez
          obs.unobserve(entry.target);
        }
      });
  
      // Si hay elementos visibles en este momento, los animamos en bloque (batch)
      // para que aparezcan progresivamente (stagger) en vez de todos a la vez.
      if (intersectingElements.length > 0) {
        if (batchTimeout) clearTimeout(batchTimeout);
  
        batchTimeout = setTimeout(() => {
          gsap.to(intersectingElements, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: 0.15, // Retardo entre cada elemento del grupo para el efecto escalonado
            ease: "power2.out",
          });
          // Limpiamos la cola para el próximo grupo
          intersectingElements = [];
        }, 50);
      }
    }, observerOptions);
  
    // Empezar a observar todos los elementos
    scrollElements.forEach((el) => {
      observer.observe(el);
    });
  } else {
    console.error("GSAP no está cargado. Las animaciones no funcionarán.");
  }
});

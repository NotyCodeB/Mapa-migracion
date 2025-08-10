



window.addEventListener("load", () => {
    const secuencias = [
        [".tema1-rec", ".tema1-data", ".tema1-lin"],
        [".tema2-rec", ".tema2-data", ".tema2-lin"],
        [".tema3-rec", ".tema3-data", ".tema3-lin"],
        [".tema4-rec", ".tema4-data", ".tema4-lin"],
        [".tema5-rec", ".tema5-data", ".tema5-lin"],
        [".tema6-rec", ".tema6-lbox", ".tema6-btn", ".tema6-rec2"]
    ];

    // Ocultar todas las capas
    secuencias.flat().forEach(selector => {
        gsap.set(selector, { autoAlpha: 0 });
    });

    // Esperar a que todos los objetos SVG estén cargados
    const objects = Array.from(document.querySelectorAll('object[type="image/svg+xml"]'));
    let loaded = 0;
    objects.forEach(obj => {
        obj.addEventListener('load', () => {
            loaded++;
            if (loaded === objects.length) {
                iniciarAnimacion();
            }
        });
        if (obj.contentDocument && obj.contentDocument.querySelector('svg')) {
            loaded++;
        }
    });
    if (loaded === objects.length) {
        iniciarAnimacion();
    }

    function iniciarAnimacion() {
        let delay = 0;
        let prevGrupo = [];
        secuencias.forEach((grupo, i) => {
            // Ocultar el grupo anterior
            if (i > 0) {
                prevGrupo.forEach(selector => {
                    gsap.to(selector, { autoAlpha: 0, duration: 0.5, delay });
                });
                delay += 0.5;
            }
            // Mostrar REC con animación desde abajo
            const rec = grupo.find(sel => sel.endsWith('-rec'));
            if (rec) {
                gsap.fromTo(
                    rec,
                    { autoAlpha: 0, y: 100 },
                    { autoAlpha: 1, y: 0, duration: 1, delay, ease: 'power2.out' }
                );
                delay += 1 ;
            }
            // Mostrar DATA o LBOX/BOTÓN
            const data = grupo.find(sel => sel.endsWith('-data') || sel.endsWith('-lbox') || sel.endsWith('-btn'));
            if (data) {
                gsap.to(data, { autoAlpha: 1, duration: 1, delay });
                delay += 1 + 2;
            }
            // Mostrar y animar LIN
            const lin = grupo.find(sel => sel.endsWith('-lin'));
            if (lin) {
                const obj = document.querySelector(lin);
                if (obj && obj.contentDocument && obj.contentDocument.querySelector('svg')) {
                    gsap.to(lin, { autoAlpha: 1, duration: 1, delay });
                    animarLineas(obj, delay);
                }
                delay += 1 + 4;
            }
            prevGrupo = grupo;
        });

        // Al finalizar, ocultar todo y mostrar solo REC-TESTIMONIOS reducido
        const tiempoFinal = delay + 1;
        setTimeout(() => {
            // Ocultar todo menos .tema6-rec2
            secuencias.flat().forEach(selector => {
                if (selector !== '.tema6-rec2') {
                    gsap.to(selector, { autoAlpha: 0, duration: 0.5 });
                }
            });
            // Mostrar y reducir tamaño de REC-TESTIMONIOS
            const recTestimonios = document.querySelector('.tema6-rec2');
            if (recTestimonios) {
                gsap.to(recTestimonios, {
                    autoAlpha: 1,
                    width: '30%',
                    height: '30%',
                    left: '35%',
                    top: '35%',
                    duration: 1
                });
            }
        }, tiempoFinal * 1000);
    }

    function animarLineas(obj, delay = 0) {
        const svg = obj.contentDocument.querySelector('svg');
        if (svg) {
            const paths = svg.querySelectorAll('path');
            paths.forEach(path => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            });
            paths.forEach((path, i) => {
                const length = path.getTotalLength();
                gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: 2,
                    delay: delay + i * 0.1,
                    ease: 'power1.inOut'
                });
            });
        }
    }
});


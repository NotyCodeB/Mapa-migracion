gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
    // ocultar todo menos base al inicio
    gsap.set("object:not(.base)", { autoAlpha: 0 });

    const grupos = [
        { rec: ".tema1-rec", data: ".tema1-data", lin: ".tema1-lin" },
        { rec: ".tema2-rec", data: ".tema2-data", lin: ".tema2-lin" },
        { rec: ".tema3-rec", data: ".tema3-data", lin: ".tema3-lin" },
        { rec: ".tema4-rec", data: ".tema4-data", lin: ".tema4-lin" },
        { rec: ".tema5-rec", data: ".tema5-data", lin: ".tema5-lin" },
        { rec: ".tema6-rec", btn: ".tema6-btn", lbox: ".tema6-lbox", extra: ".tema6-extra" }
    ];

    const sections = document.querySelectorAll(".scroll-section");
    const timelines = new Array(grupos.length).fill(null);

    grupos.forEach((g, i) => {
        const section = sections[i + 1]; // +1 por la intro
        if (!section) return;

        // construir timeline (pausado) con la secuencia 
        const tl = gsap.timeline({ paused: true });

        if (i !== 5) {
            // Secuencia estandar REC -> DATA -> LIN
            tl.fromTo(g.rec, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false });
            tl.to(g.data, { autoAlpha: 1, duration: 0.5 });
            tl.call(() => animarLineas(g.lin), null, "+=0"); // preparar/dibujar líneas
            tl.to(g.lin, { autoAlpha: 1, duration: 0.6 });
        } else {
            // Sección especial Testimonios: REC -> BTN -> BTN out -> LBOX
            tl.fromTo(g.rec, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.6, immediateRender: false });
            tl.to(g.btn, { autoAlpha: 1, duration: 0.5 });
            tl.to(g.btn, { autoAlpha: 0, duration: 0.4 });
            tl.to(g.lbox, { autoAlpha: 1, duration: 0.6 });
        }

        timelines[i] = tl;

        // ScrollTrigger que controla play / reverse del timeline
        ScrollTrigger.create({
            trigger: section,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => {
                hideOtherGroups(i);
                // reiniciar y reproducir desde 0
                tl.pause(0);
                tl.play();
                // ocultar icono de scroll cuando se entra a la primera sección
                if (i === 0) gsap.to(".scroll-icon", { autoAlpha: 0, duration: 0.5 });
            },
            onEnterBack: () => {
                hideOtherGroups(i);
                tl.pause(0);
                tl.play();
            },
            onLeave: () => {
                // reproducir inverso para limpiar (más suave)
                tl.reverse();
            },
            onLeaveBack: () => {
                tl.reverse();
            }
        });
    });

    function hideOtherGroups(activeIndex) {
        grupos.forEach((g, idx) => {
            if (idx === activeIndex) return;
            // pausar timeline de otros grupos
            if (timelines[idx]) {
                timelines[idx].pause(0);
            }
            // ocultar todos los selectores de ese grupo inmediatamente
            Object.values(g).filter(Boolean).forEach(sel => gsap.set(sel, { autoAlpha: 0 }));
            // reiniciar cualquier offset de línea si es necesario (para que pueda redibujarse al volver a entrar)
            const linSel = g.lin || g.btn; // possible line selector
            if (linSel) {
                const obj = document.querySelector(linSel);
                if (obj && obj.contentDocument) {
                    const paths = obj.contentDocument.querySelectorAll("path");
                    paths.forEach(p => {
                        const len = p.getTotalLength();
                        p.style.strokeDasharray = len;
                        p.style.strokeDashoffset = len;
                    });
                }
            }
        });
    }

    function animarLineas(selector) {
        const obj = document.querySelector(selector);
        if (!obj) return;
        // esperar a que el object cargue si aún no está listo
        if (!obj.contentDocument) {
            obj.addEventListener("load", () => animarLineas(selector), { once: true });
            return;
        }
        const svg = obj.contentDocument.querySelector("svg");
        if (!svg) return;
        const paths = Array.from(svg.querySelectorAll("path"));
        // set inicial
        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });
        // animar trazos
        gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.1,
            stagger: 0.05,
            ease: "power1.inOut"
        });
    }
});

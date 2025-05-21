document.addEventListener("DOMContentLoaded", () => {
    const botonMenu = document.getElementById("menu-toggle");
    const menuMovil = document.getElementById("mobile-menu");

    botonMenu?.addEventListener("click", () => {
        menuMovil?.classList.toggle("hidden");
    });

    const contadores = document.querySelectorAll('.counter');

    contadores.forEach(contador => {
        const objetivo = parseInt(contador.getAttribute('data-target'));
        const duracion = 2000;
        const paso = objetivo / (duracion / 16);
        let actual = 0;
        let iniciado = false;

        const actualizarContador = () => {
            actual += paso;
            if (actual < objetivo) {
                contador.textContent = Math.floor(actual);
                requestAnimationFrame(actualizarContador);
            } else {
                contador.textContent = objetivo;
            }
        };

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && !iniciado) {
                    iniciado = true;
                    actualizarContador();
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        observador.observe(contador);
    });

    const animaciones = {
        'reveal-title': 'fadeInDown',
        'reveal-left': 'fadeInLeft',
        'reveal-right': 'fadeInRight',
        'reveal-up': 'fadeInUp',
        'gallery-item': 'zoomIn'
    };

    const animarAlDesplazar = () => {
        const elementos = document.querySelectorAll(
            '.reveal-title, .reveal-left, .reveal-right, .reveal-up, .gallery-item, [class^="feature-card-"], [class^="reveal-item-"]'
        );

        elementos.forEach(elemento => {
            const posicionElemento = elemento.getBoundingClientRect().top;
            const altoVentana = window.innerHeight;

            if (posicionElemento < altoVentana * 0.85) {
                for (const clase in animaciones) {
                    if (elemento.classList.contains(clase)) {
                        elemento.classList.add('animate__animated', `animate__${animaciones[clase]}`);
                        return;
                    }
                }

                if (elemento.className.includes('feature-card-')) {
                    const match = elemento.className.match(/feature-card-(\d+)/);
                    const delay = match ? parseInt(match[1]) * 0.1 : 0;
                    elemento.style.animationDelay = `${delay}s`;
                    elemento.classList.add('animate__animated', 'animate__fadeInUp');
                } else if (elemento.className.includes('reveal-item-')) {
                    const match = elemento.className.match(/reveal-item-(\d+)/);
                    const delay = match ? parseInt(match[1]) * 0.1 : 0;
                    elemento.style.animationDelay = `${delay}s`;
                    elemento.classList.add('animate__animated', 'animate__fadeInUp');
                }
            }
        });
    };

    animarAlDesplazar();
    window.addEventListener('scroll', animarAlDesplazar);

    const formularioContacto = document.getElementById('contactForm');
    const mensajeExito = document.getElementById('formSuccess');

    formularioContacto?.addEventListener('submit', (e) => {
        e.preventDefault();

        setTimeout(() => {
            mensajeExito.classList.remove('hidden');
            formularioContacto.reset();

            setTimeout(() => {
                mensajeExito.classList.add('hidden');
            }, 5000);
        }, 1000);
    });

    const inputBusqueda = document.getElementById('searchInput');
    const grillaNoticias = document.getElementById('newsGrid');
    const estadoVacio = document.getElementById('emptyState');
    const paginador = document.getElementById('pagination');

    if (!grillaNoticias) return;

    const tarjetasNoticias = Array.from(grillaNoticias.querySelectorAll('.animate__fadeIn'));
    const botonesCategoria = document.querySelectorAll('[data-category]');
    const noticiasPorPagina = 3;

    let noticiasFiltradas = [...tarjetasNoticias];
    let paginaActual = 1;

    const mostrarPagina = (pagina) => {
        paginaActual = pagina;
        const inicio = (pagina - 1) * noticiasPorPagina;
        const fin = inicio + noticiasPorPagina;

        tarjetasNoticias.forEach(n => (n.style.display = 'none'));

        const noticiasPagina = noticiasFiltradas.slice(inicio, fin);
        noticiasPagina.forEach(n => (n.style.display = 'block'));

        verificarNoticiasVisibles();
        actualizarPaginado();
    };

    const actualizarPaginado = () => {
        const totalPaginas = Math.ceil(noticiasFiltradas.length / noticiasPorPagina);
        paginador.innerHTML = '';

        if (totalPaginas <= 1) {
            paginador.style.display = 'none';
            return;
        }

        paginador.style.display = 'flex';

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `px-4 py-2 rounded-md border ${i === paginaActual
                ? 'colorPrincipalFondo text-white cursor-pointer'
                : 'bg-white colorPrincipalTexto colorPrincipalTextoHover cursor-pointer'
            }`;
            btn.addEventListener('click', () => mostrarPagina(i));
            paginador.appendChild(btn);
        }
    };

    const verificarNoticiasVisibles = () => {
        if (noticiasFiltradas.length === 0) {
            estadoVacio.classList.remove('hidden');
            grillaNoticias.classList.add('hidden');
            paginador.style.display = 'none';
        } else {
            estadoVacio.classList.add('hidden');
            grillaNoticias.classList.remove('hidden');
        }
    };

    const aplicarFiltros = () => {
        const termino = inputBusqueda.value.toLowerCase();
        const categoriaActiva = document.querySelector('[data-category].bg-blue-600')?.getAttribute('data-category') || 'Todas';

        noticiasFiltradas = tarjetasNoticias.filter(tarjeta => {
            const titulo = tarjeta.querySelector('h3')?.textContent.toLowerCase() || '';
            const resumen = tarjeta.querySelector('p')?.textContent.toLowerCase() || '';
            const coincideBusqueda = titulo.includes(termino) || resumen.includes(termino);
            const coincideCategoria = categoriaActiva === 'Todas' || tarjeta.dataset.categoria === categoriaActiva;

            return coincideBusqueda && coincideCategoria;
        });

        mostrarPagina(1);
    };

    const actualizarEstilosCategorias = (activo) => {
        botonesCategoria.forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });

        activo.classList.remove('bg-gray-100', 'text-gray-700');
        activo.classList.add('bg-blue-600', 'text-white');
    };

    inputBusqueda?.addEventListener('input', aplicarFiltros);

    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', function () {
            actualizarEstilosCategorias(this);
            aplicarFiltros();
        });
    });

    mostrarPagina(paginaActual);
});

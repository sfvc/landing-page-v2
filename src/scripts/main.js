document.addEventListener("DOMContentLoaded", function () {
    const botonMenu = document.getElementById("menu-toggle");
    const menuMovil = document.getElementById("mobile-menu");

    botonMenu?.addEventListener("click", function () {
        menuMovil?.classList.toggle("hidden");
    });

    const contadores = document.querySelectorAll('.counter');

    contadores.forEach(contador => {
        const objetivo = parseInt(contador.getAttribute('data-target'));
        const duracion = 2000;
        const paso = objetivo / (duracion / 16);
        let actual = 0;

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
                if (entrada.isIntersecting) {
                    actualizarContador();
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.5 });

        observador.observe(contador);
    });

    const animarAlDesplazar = () => {
        const elementos = document.querySelectorAll(
            '.reveal-title, .reveal-left, .reveal-right, .reveal-up, .gallery-item, [class^="feature-card-"], [class^="reveal-item-"]'
        );

        elementos.forEach(elemento => {
            const posicionElemento = elemento.getBoundingClientRect().top;
            const altoVentana = window.innerHeight;

            if (posicionElemento < altoVentana * 0.85) {
                if (elemento.classList.contains('reveal-title')) {
                    elemento.classList.add('animate__animated', 'animate__fadeInDown');
                } else if (elemento.classList.contains('reveal-left')) {
                    elemento.classList.add('animate__animated', 'animate__fadeInLeft');
                } else if (elemento.classList.contains('reveal-right')) {
                    elemento.classList.add('animate__animated', 'animate__fadeInRight');
                } else if (elemento.classList.contains('reveal-up')) {
                    elemento.classList.add('animate__animated', 'animate__fadeInUp');
                } else if (elemento.classList.contains('gallery-item')) {
                    elemento.classList.add('animate__animated', 'animate__zoomIn');
                } else if (elemento.className.includes('feature-card-')) {
                    const delay = elemento.className.match(/feature-card-(\d+)/)[1] * 0.1;
                    elemento.style.animationDelay = `${delay}s`;
                    elemento.classList.add('animate__animated', 'animate__fadeInUp');
                } else if (elemento.className.includes('reveal-item-')) {
                    const delay = elemento.className.match(/reveal-item-(\d+)/)[1] * 0.1;
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

    formularioContacto?.addEventListener('submit', function (e) {
        e.preventDefault();

        setTimeout(() => {
            mensajeExito.classList.remove('hidden');
            formularioContacto.reset();

            setTimeout(() => {
                mensajeExito.classList.add('hidden');
            }, 5000);
        }, 1000);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const inputBusqueda = document.getElementById('searchInput');
    const grillaNoticias = document.getElementById('newsGrid');
    const estadoVacio = document.getElementById('emptyState');
    const tarjetasNoticias = Array.from(grillaNoticias.querySelectorAll('.animate__fadeIn'));
    const botonesCategoria = document.querySelectorAll('[data-category]');
    const paginador = document.getElementById('pagination');
    const noticiasPorPagina = 3;

    let noticiasFiltradas = [...tarjetasNoticias];
    let paginaActual = 1;

    function mostrarPagina(pagina) {
        paginaActual = pagina;
        const inicio = (pagina - 1) * noticiasPorPagina;
        const fin = inicio + noticiasPorPagina;

        tarjetasNoticias.forEach(n => (n.style.display = 'none'));

        const noticiasPagina = noticiasFiltradas.slice(inicio, fin);
        noticiasPagina.forEach(n => (n.style.display = 'block'));

        verificarNoticiasVisibles();
        actualizarPaginado();
    }

    function actualizarPaginado() {
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
            btn.className = `px-4 py-2 rounded-md border ${i === paginaActual ? 'bg-blue-600 text-white cursor-pointer' : 'bg-white text-blue-600 hover:bg-blue-100 cursor-pointer'
                }`;
            btn.addEventListener('click', () => mostrarPagina(i));
            paginador.appendChild(btn);
        }
    }

    function verificarNoticiasVisibles() {
        if (noticiasFiltradas.length === 0) {
            estadoVacio.classList.remove('hidden');
            grillaNoticias.classList.add('hidden');
            paginador.style.display = 'none';
        } else {
            estadoVacio.classList.add('hidden');
            grillaNoticias.classList.remove('hidden');
        }
    }

    function aplicarFiltros() {
        const termino = inputBusqueda.value.toLowerCase();
        const categoriaActiva = document.querySelector('[data-category].bg-blue-600')?.getAttribute('data-category');

        noticiasFiltradas = tarjetasNoticias.filter(tarjeta => {
            const titulo = tarjeta.querySelector('h3')?.textContent.toLowerCase() || '';
            const resumen = tarjeta.querySelector('p')?.textContent.toLowerCase() || '';
            const coincideBusqueda = titulo.includes(termino) || resumen.includes(termino);
            const coincideCategoria = categoriaActiva === 'Todas' || !categoriaActiva || tarjeta.dataset.categoria === categoriaActiva;

            return coincideBusqueda && coincideCategoria;
        });

        paginaActual = 1;
        mostrarPagina(paginaActual);
    }

    inputBusqueda?.addEventListener('input', aplicarFiltros);

    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', function () {
            botonesCategoria.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });

            this.classList.remove('bg-gray-100', 'text-gray-700');
            this.classList.add('bg-blue-600', 'text-white');

            aplicarFiltros();
        });
    });

    mostrarPagina(paginaActual);
});

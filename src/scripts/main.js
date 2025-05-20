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

document.addEventListener("DOMContentLoaded", function () {
    const inputBusqueda = document.getElementById('searchInput');
    const grillaNoticias = document.getElementById('newsGrid');
    const estadoVacio = document.getElementById('emptyState');
    const tarjetasNoticias = grillaNoticias.querySelectorAll('.animate__fadeIn');

    inputBusqueda?.addEventListener('input', function (e) {
        const termino = e.target.value.toLowerCase();
        let hayResultados = false;

        tarjetasNoticias.forEach(tarjeta => {
            const titulo = tarjeta.querySelector('h3').textContent.toLowerCase();
            const resumen = tarjeta.querySelector('p').textContent.toLowerCase();

            if (titulo.includes(termino) || resumen.includes(termino)) {
                tarjeta.style.display = 'block';
                hayResultados = true;
            } else {
                tarjeta.style.display = 'none';
            }
        });

        if (hayResultados) {
            estadoVacio.classList.add('hidden');
            grillaNoticias.classList.remove('hidden');
        } else {
            estadoVacio.classList.remove('hidden');
            grillaNoticias.classList.add('hidden');
        }
    });

    const botonesCategoria = document.querySelectorAll('[data-category]');

    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', function () {

            botonesCategoria.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });

            this.classList.remove('bg-gray-100', 'text-gray-700');
            this.classList.add('bg-blue-600', 'text-white');

            const categoria = this.getAttribute('data-category');

            if (categoria === 'Todas') {
                tarjetasNoticias.forEach(tarjeta => {
                    tarjeta.style.display = 'block';
                });
                estadoVacio.classList.add('hidden');
                grillaNoticias.classList.remove('hidden');
                return;
            }

            let hayResultados = false;

            tarjetasNoticias.forEach(tarjeta => {
                const mostrar = Math.random() > 0.5;

                if (mostrar) {
                    tarjeta.style.display = 'block';
                    hayResultados = true;
                } else {
                    tarjeta.style.display = 'none';
                }
            });

            if (hayResultados) {
                estadoVacio.classList.add('hidden');
                grillaNoticias.classList.remove('hidden');
            } else {
                estadoVacio.classList.remove('hidden');
                grillaNoticias.classList.add('hidden');
            }
        });
    });
});

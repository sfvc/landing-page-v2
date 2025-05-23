import { catamarcaApi } from "../api/catamarcaApi";

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}

function adjustBrightness(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const newR = Math.min(255, Math.max(0, Math.floor(r + 255 * amount)));
  const newG = Math.min(255, Math.max(0, Math.floor(g + 255 * amount)));
  const newB = Math.min(255, Math.max(0, Math.floor(b + 255 * amount)));
  return rgbToHex(newR, newG, newB);
}

async function actualizarColorPrincipal() {
  try {
    const response = await catamarcaApi.get('items/Punto_Joven_Colores');
    const data = await response.data;

    if (!data.data || data.data.length === 0) throw new Error('No hay datos de colores');

    const colores = data.data[0];

    const colorFondo = colores.color_principal_fondo || '#3E5A7E';
    const colorTexto = colores.color_principal_texto || '#4b6d9a';

    const colorFondoHover = adjustBrightness(colorFondo, 0.2);
    const colorTextoHover = adjustBrightness(colorTexto, 0.2);

    const colorBorde = adjustBrightness(colorFondo, -0.15);

    document.documentElement.style.setProperty('--color-principal-fondo', colorFondo);
    document.documentElement.style.setProperty('--color-principal-fondo-hover', colorFondoHover);
    document.documentElement.style.setProperty('--color-principal-texto', colorTexto);
    document.documentElement.style.setProperty('--color-principal-texto-hover', colorTextoHover);
    document.documentElement.style.setProperty('--color-principal-borde', colorBorde);

  } catch (error) {
    console.error('Error al traer color desde Directus:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarColorPrincipal();

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
      btn.className = `px-4 py-2 rounded-md border ${
        i === paginaActual
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

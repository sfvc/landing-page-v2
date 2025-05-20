document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    menuToggle?.addEventListener("click", function () {
        mobileMenu?.classList.toggle("hidden");
    });

    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);

        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });

    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.reveal-title, .reveal-left, .reveal-right, .reveal-up, .gallery-item, [class^="feature-card-"], [class^="reveal-item-"]');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight * 0.85) {
                if (element.classList.contains('reveal-title')) {
                    element.classList.add('animate__animated', 'animate__fadeInDown');
                } else if (element.classList.contains('reveal-left')) {
                    element.classList.add('animate__animated', 'animate__fadeInLeft');
                } else if (element.classList.contains('reveal-right')) {
                    element.classList.add('animate__animated', 'animate__fadeInRight');
                } else if (element.classList.contains('reveal-up')) {
                    element.classList.add('animate__animated', 'animate__fadeInUp');
                } else if (element.classList.contains('gallery-item')) {
                    element.classList.add('animate__animated', 'animate__zoomIn');
                } else if (element.className.includes('feature-card-')) {
                    const delay = element.className.match(/feature-card-(\d+)/)[1] * 0.1;
                    element.style.animationDelay = `${delay}s`;
                    element.classList.add('animate__animated', 'animate__fadeInUp');
                } else if (element.className.includes('reveal-item-')) {
                    const delay = element.className.match(/reveal-item-(\d+)/)[1] * 0.1;
                    element.style.animationDelay = `${delay}s`;
                    element.classList.add('animate__animated', 'animate__fadeInUp');
                }
            }
        });
    };

    animateOnScroll();

    window.addEventListener('scroll', animateOnScroll);

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    contactForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        setTimeout(() => {
            formSuccess.classList.remove('hidden');
            contactForm.reset();

            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }, 1000);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('searchInput');
    const newsGrid = document.getElementById('newsGrid');
    const emptyState = document.getElementById('emptyState');
    const newsCards = newsGrid.querySelectorAll('.animate__fadeIn');

    searchInput?.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        let hasResults = false;

        newsCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const summary = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        if (hasResults) {
            emptyState.classList.add('hidden');
            newsGrid.classList.remove('hidden');
        } else {
            emptyState.classList.remove('hidden');
            newsGrid.classList.add('hidden');
        }
    });

    const categoryButtons = document.querySelectorAll('[data-category]');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });

            this.classList.remove('bg-gray-100', 'text-gray-700');
            this.classList.add('bg-blue-600', 'text-white');

            const category = this.getAttribute('data-category');


            if (category === 'Todas') {
                newsCards.forEach(card => {
                    card.style.display = 'block';
                });
                emptyState.classList.add('hidden');
                newsGrid.classList.remove('hidden');
                return;
            }

            let hasResults = false;
            newsCards.forEach((card, index) => {
                const shouldShow = Math.random() > 0.5;

                if (shouldShow) {
                    card.style.display = 'block';
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (hasResults) {
                emptyState.classList.add('hidden');
                newsGrid.classList.remove('hidden');
            } else {
                emptyState.classList.remove('hidden');
                newsGrid.classList.add('hidden');
            }
        });
    });
});

// JavaScript para Ingrid Morais Nutricionista - Interatividade e Recursos Dinâmicos

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Menu Mobile (Hamburguer)
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('header nav ul');
    const navItems = document.querySelectorAll('header nav ul li a');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });

        // Fecha o menu ao clicar em qualquer link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // 2. Carrossel de Depoimentos (Testimonials)
    // ==========================================
    const slides = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        // Criar indicadores de bolinhas (dots)
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateCarousel() {
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                if (index === currentSlide) {
                    slide.classList.add('active');
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev');
                } else if (index === (currentSlide + 1) % slides.length) {
                    slide.classList.add('next');
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
            resetAutoplay();
        }

        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 6000); // Avança a cada 6 segundos
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        // Inicializa o carrossel e começa autoplay
        updateCarousel();
        startAutoplay();

        // Pausa autoplay quando o mouse está sobre o carrossel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', startAutoplay);
        }
    }

    // ==========================================
    // 3. Calculadora de IMC Interativa
    // ==========================================
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pesoInput = document.getElementById('bmi-peso');
            const alturaInput = document.getElementById('bmi-altura');
            const resultBox = document.getElementById('bmi-result-box');
            
            const peso = parseFloat(pesoInput.value.replace(',', '.'));
            let altura = parseFloat(alturaInput.value.replace(',', '.'));
            
            if (!peso || !altura || peso <= 0 || altura <= 0) {
                alert('Por favor, insira valores válidos de peso e altura.');
                return;
            }
            
            // Se a altura foi digitada em centímetros (ex: 175 em vez de 1.75)
            if (altura > 3) {
                altura = altura / 100;
            }
            
            const imc = (peso / (altura * altura)).toFixed(1);
            
            let status = '';
            let colorClass = '';
            let textAdvice = '';
            
            if (imc < 18.5) {
                status = 'Abaixo do peso';
                colorClass = 'bmi-underweight';
                textAdvice = 'Seu peso está abaixo do ideal. Uma alimentação estratégica pode ajudar no ganho saudável de massa muscular e nutrientes essenciais.';
            } else if (imc >= 18.5 && imc < 25) {
                status = 'Peso Normal';
                colorClass = 'bmi-normal';
                textAdvice = 'Parabéns! Seu peso está na faixa ideal. O acompanhamento nutricional pode ajudar você a manter a energia, otimizar sua composição corporal ou hipertrofiar.';
            } else if (imc >= 25 && imc < 30) {
                status = 'Sobrepeso';
                colorClass = 'bmi-overweight';
                textAdvice = 'Indica um leve excesso de peso. Pequenos ajustes na rotina alimentar e reeducação sem dietas extremas trazem excelentes resultados definitivos.';
            } else {
                status = 'Obesidade';
                colorClass = 'bmi-obese';
                textAdvice = 'Alerta de saúde metabólica. Um planejamento nutricional personalizado é fundamental para reduzir inflamações, melhorar exames e emagrecer com saúde.';
            }
            
            // Exibir resultados de forma fluida
            resultBox.innerHTML = `
                <div class="bmi-value-display ${colorClass}">
                    <span class="bmi-num">${imc}</span>
                    <span class="bmi-status">${status}</span>
                </div>
                <p class="bmi-advice">${textAdvice}</p>
                <div class="bmi-cta-box">
                    <a href="https://wa.me/55035991196419?text=Olá,%20fiz%20o%20teste%20de%20IMC%20(deu%20${imc}%20-%20${status})%20e%20gostaria%20de%20marcar%20uma%20consulta." target="_blank" class="btn btn-small">Marcar Consulta Personalizada</a>
                </div>
            `;
            
            resultBox.classList.add('active');
        });
    }

    // ==========================================
    // 4. Animações de Scroll (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Uma vez revelado, não precisamos mais observar esse elemento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback caso o navegador não suporte IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // ==========================================
    // 5. Efeito Sticky Header com cor reduzida ao rolar
    // ==========================================
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

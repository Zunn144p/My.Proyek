// === ANIMASI SCROLL & KLIK ===

// Scroll Animations
function initScrollAnimations() {
    console.log('Initializing scroll animations...');
    
    // Intersection Observer untuk animasi scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animasi untuk product cards dalam section
                const productCards = entry.target.querySelectorAll('.product-card');
                productCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe semua sections
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Observer untuk elements individual
    const elementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe berbagai elements
    document.querySelectorAll('.product-card, .stat-card, .user-stat-card, .order-item, .tech-stat').forEach(element => {
        elementObserver.observe(element);
    });

    console.log('Scroll animations initialized');
}

// Smooth Scroll dengan Offset untuk Navigation Fixed
function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Adjust for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Add animation class to section
        section.classList.add('active');
    }
}

// Ripple Effect untuk Klik
function initRippleEffect() {
    document.addEventListener('click', function(e) {
        // Hanya trigger untuk element tertentu
        if (e.target.matches('.btn-primary, .btn-secondary, .add-to-cart, .product-card, .nav-link, .category-btn')) {
            createRipple(e);
        }
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Mouse Wheel Scroll dengan Momentum
function initMomentumScroll() {
    let isScrolling = false;
    
    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            isScrolling = true;
            
            const direction = e.deltaY > 0 ? 1 : -1;
            scrollToNextSection(direction);
            
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }, { passive: true });
}

function scrollToNextSection(direction) {
    const sections = Array.from(document.querySelectorAll('.section'));
    const currentScroll = window.scrollY + 80; // Adjust for navbar
    
    let targetSection = null;
    
    if (direction > 0) {
        // Scroll down - cari section berikutnya
        targetSection = sections.find(section => section.offsetTop > currentScroll);
    } else {
        // Scroll up - cari section sebelumnya (dalam urutan terbalik)
        const reversedSections = [...sections].reverse();
        targetSection = reversedSections.find(section => section.offsetTop < currentScroll - 100);
    }
    
    if (targetSection) {
        smoothScrollToSection(targetSection.id);
    }
}

// Animasi untuk Add to Cart
function enhanceAddToCart() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            // Animasi button click
            e.target.classList.add('btn-clicked');
            setTimeout(() => {
                e.target.classList.remove('btn-clicked');
            }, 300);
            
            // Animasi cart icon bounce
            const cartIcon = document.querySelector('.nav-cart i');
            const cartCount = document.querySelector('.cart-count');
            
            if (cartIcon) {
                cartIcon.classList.add('cart-bounce');
                setTimeout(() => {
                    cartIcon.classList.remove('cart-bounce');
                }, 600);
            }
            
            if (cartCount) {
                cartCount.classList.add('cart-bounce');
                setTimeout(() => {
                    cartCount.classList.remove('cart-bounce');
                }, 600);
            }
        }
    });
}

// Hover Animations
function initHoverAnimations() {
    // Scale effect on hover
    const hoverElements = document.querySelectorAll('.product-card, .stat-card, .user-stat-card, .dev-product-card');
    
    hoverElements.forEach(element => {
        element.classList.add('hover-scale');
    });
}

// Loading Animations untuk Content
function initLoadingAnimations() {
    // Stagger animation untuk product grid
    const productGrid = document.querySelector('.products-grid');
    if (productGrid) {
        const productCards = productGrid.querySelectorAll('.product-card');
        productCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Add page load animation to main content
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.classList.add('page-load');
    }
}

// Keyboard Navigation dengan Animasi
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            scrollToNextSection(direction);
        }
        
        // Escape key untuk close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// Touch Swipe untuk Mobile
function initTouchSwipe() {
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const diffY = startY - endY;
        const duration = Date.now() - startTime;
        
        // Minimum swipe distance and maximum duration for better UX
        if (Math.abs(diffY) > 50 && duration < 500) {
            const direction = diffY > 0 ? 1 : -1;
            scrollToNextSection(direction);
        }
    }, { passive: true });
}

// Scroll Indicator Behavior
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        // Hide scroll indicator when at bottom
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            if (scrollTop + windowHeight >= documentHeight - 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// Animation utilities
function animateElement(element, animationClass, duration = 1000) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

function shakeElement(element) {
    animateElement(element, 'shake', 600);
}

function bounceElement(element) {
    animateElement(element, 'bounce-in', 800);
}

function pulseElement(element) {
    animateElement(element, 'pulse', 2000);
}

// Initialize semua animasi
function initAllAnimations() {
    initScrollAnimations();
    initRippleEffect();
    initScrollProgress();
    initMomentumScroll();
    enhanceAddToCart();
    initHoverAnimations();
    initLoadingAnimations();
    initKeyboardNavigation();
    initTouchSwipe();
    initScrollIndicator();
    
    console.log('All animations initialized successfully');
}

// Export functions untuk global use
window.smoothScrollToSection = smoothScrollToSection;
window.initAllAnimations = initAllAnimations;
window.createRipple = createRipple;
window.animateElement = animateElement;
window.shakeElement = shakeElement;
window.bounceElement = bounceElement;
window.pulseElement = pulseElement;

// Auto initialize ketika DOM ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initAllAnimations, 100);
});

// Re-initialize ketika window resize (untuk responsive adjustments)
window.addEventListener('resize', function() {
    setTimeout(initScrollAnimations, 300);
});

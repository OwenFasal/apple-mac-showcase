/* FILE 3: script.js */

// Email Configuration (Formspree for functional email sending)
const FORM_ID = 'YOUR_FORMSPREE_ID_HERE'; // Replace with your actual Formspree ID

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCROLL PROGRESS INDICATOR ---
    const progressBar = document.querySelector('.progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollPosition / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // --- 2. SCROLL ANIMATION SYSTEM - Enhanced with Intersection Observer ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for child elements
                const children = entry.target.children;
                children.forEach((child, index) => {
                    setTimeout(() => {
                        if (!child.classList.contains('visible')) {
                            child.classList.add('visible');
                        }
                    }, index * 100);
                });
                
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-item, .fade-up');
    revealElements.forEach(el => observer.observe(el));

    // --- 3. CHART ANIMATION ON LOAD ---
    const progressBars = document.querySelectorAll('.progress-fill');
    
    setTimeout(() => {
        progressBars.forEach(bar => {
            const percentage = bar.getAttribute('--p');
            bar.style.width = `${percentage}%`;
        });
    }, 500);

    // --- 4. CONFIG WIDGET LOGIC - Enhanced with animations ---
    const modelSelect = document.getElementById('model-select');
    const ramBtns = document.querySelectorAll('.mem-btn');
    const storageBtns = document.querySelectorAll('.storage-btn');
    const displaySelect = document.getElementById('display-select');
    const chipSelect = document.getElementById('chip-select');
    const modelNameDisplay = document.getElementById('model-name-display');
    const totalPriceDisplay = document.getElementById('total-price');
    const configSpecsDisplay = document.getElementById('config-specs');

    const basePrices = {
        'neo': 999,
        'air': 1299,
        'pro14': 1999,
        'pro16': 2999,
        'studio': 3499,
        'macpro': 6999
    };

    const ramPrices = {
        '8gb': 0,
        '16gb': 200,
        '24gb': 400,
        '36gb': 800,
        '64gb': 1200,
        '96gb': 2000,
        '128gb': 3000
    };

    const storagePrices = {
        '512gb': 0,
        '1tb': 200,
        '2tb': 400,
        '4tb': 800,
        '8tb': 1600
    };

    const chipAddons = {
        'base': 0,
        'pro': 500,
        'max': 1000,
        'ultra': 2000
    };

    const displayAddons = {
        'standard': 0,
        'xdr': 800,
        'mini': 400
    };

    const modelNames = {
        'neo': 'MacBook Neo 13"',
        'air': 'MacBook Air 15"',
        'pro14': 'MacBook Pro 14"',
        'pro16': 'MacBook Pro 16"',
        'studio': 'Mac Studio',
        'macpro': 'Mac Pro'
    };

    function updateConfig() {
        const model = modelSelect.value;
        const ram = document.querySelector('.mem-btn.active').dataset.ram;
        const storage = document.querySelector('.storage-btn.active').dataStorage;
        const display = displaySelect.value === 'xdr' ? 800 : 0;
        const chip = chipSelect.value;

        modelNameDisplay.textContent = modelNames[model];
        
        // Animate Price Change with smooth transition
        const currentPrice = parseInt(totalPriceDisplay.innerText.replace(/[^0-9]/g, ''));
        const newPrice = basePrices[model] + ramPrices[ram] + storagePrices[storage] + displayAddons[display] + chipAddons[chip];

        // Smooth price transition
        totalPriceDisplay.style.transition = 'all 0.5s ease';
        totalPriceDisplay.innerText = '$' + newPrice.toLocaleString();
        
        // Update specs display
        configSpecsDisplay.innerHTML = `
            <span class="spec-badge">Chip: ${modelNames[model].split(' ')[0]}</span>
            <span class="spec-badge">Memory: ${ram}</span>
            <span class="spec-badge">Storage: ${storage}</span>
        `;

        // Remove transition after animation
        setTimeout(() => {
            totalPriceDisplay.style.transition = '';
        }, 500);

        // Animate the price change
        totalPriceDisplay.style.color = 'var(--accent-blue)';
        setTimeout(() => {
            totalPriceDisplay.style.color = 'var(--text-primary)';
        }, 500);
    }

    // Event Listeners for Config with smooth transitions
    modelSelect.addEventListener('change', () => {
        ramBtns.forEach(b => b.classList.remove('active'));
        storageBtns.forEach(b => b.classList.remove('active'));
        updateConfig();
    });

    displaySelect.addEventListener('change', updateConfig);
    chipSelect.addEventListener('change', updateConfig);
    
    ramBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ramBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateConfig();
        });
    });

    storageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            storageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateConfig();
        });
    });

    // Initialize initial state with animation
    modelSelect.addEventListener('change', () => {
        setTimeout(updateConfig, 300);
    });

    updateConfig();

    // --- 5. FORM HANDLING - Functional Email with Formspree ---
    const form = document.getElementById('proposal-form');
    const successOverlay = document.getElementById('success-overlay');
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.style.display = 'none';
        loadingSpinner.style.display = 'block';
        errorMessage.style.display = 'none';
        successOverlay.style.display = 'none';

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            company: document.getElementById('contact-company').value,
            type: document.getElementById('proposal-type').value,
            message: document.getElementById('proposal-message').value,
            phone: document.getElementById('contact-phone').value
        };

        try {
            // Simulate API call or send to Formspree
            const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Show success
                loadingSpinner.style.display = 'none';
                successOverlay.style.display = 'flex';
                
                // Clear form after delay
                setTimeout(() => {
                    form.reset();
                }, 3000);
            } else {
                throw new Error('Failed to send proposal');
            }
        } catch (error) {
            // Show error
            loadingSpinner.style.display = 'none';
            errorMessage.style.display = 'block';
            
            console.error('Form submission error:', error);
        }
    });

    window.closeSuccess = function() {
        successOverlay.style.display = 'none';
        form.reset();
    };

    window.closeError = function() {
        errorMessage.style.display = 'none';
        submitBtn.style.display = 'block';
    };

    // --- 6. SMOOTH SCROLLING - Enhanced with inertia ---
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Remove active states from all nav links
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active state to clicked link
                this.classList.add('active');
                
                // Smooth scroll with inertia
                const targetPosition = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                    duration: 1000
                });
            }
        });
    });

    // --- 7. SMOOTH SCROLLING - Scroll to top button ---
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- 8. MOUSE MOVEMENT PARALLAX EFFECTS ---
    document.addEventListener('mousemove', (e) => {
        const heroLaptop = document.querySelector('.hero-laptop');
        if (heroLaptop) {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;
            
            heroLaptop.style.transform = `scale(1.02) rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });

    // --- 9. CARD HOVER EFFECTS WITH SMOOTH TRANSITIONS ---
    document.querySelectorAll('.product-card, .chip-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        });
    });

    // --- 10. LOADER SPINNER ON PAGE LOAD ---
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div class="loader-overlay"></div>
        <div class="spinner"></div>
    `;
    document.body.appendChild(loader);

    setTimeout(() => {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);

    // --- 11. PERFORMANCE OPTIMIZATION - Lazy Load Images ---
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.loading = 'lazy';
        
        // Add loading attribute for proper lazy loading
        if (img.dataset.src) {
            img.src = '';
        }
    });

    // --- 12. CONFIGURATION ANIMATION CURVES ---
    function configureCardAnimation() {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach((card, index) => {
            card.style.animation = `slideIn 0.8s ease ${index * 0.1}s forwards, float 6s ease-in-out infinite ${index * 0.2}s`;
        });
    }

    // Initialize animations after DOM is ready
    setTimeout(configureCardAnimation, 100);

    // --- 13. NAVIGATION ACTIVE STATE ---
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- 14. BUY NOW BUTTON ANIMATION ---
    const buyBtn = document.querySelector('.buy-btn');
    
    if (buyBtn) {
        buyBtn.addEventListener('mouseenter', () => {
            buyBtn.style.boxShadow = '0 10px 50px rgba(0, 113, 227, 0.6)';
        });

        buyBtn.addEventListener('mouseleave', () => {
            buyBtn.style.boxShadow = '0 4px 20px rgba(0, 113, 227, 0.4)';
        });

        buyBtn.addEventListener('click', () => {
            // Add click animation
            buyBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                buyBtn.style.transform = 'scale(1.08)';
            }, 100);
        });
    }

    // --- 15. KEYBOARD NAVIGATION SUPPORT ---
    document.addEventListener('keydown', (e) => {
        const activeCard = document.querySelector('.card.active');
        
        if (activeCard) {
            if (e.key === 'ArrowRight') {
                const nextCard = activeCard.nextElementSibling;
                if (nextCard && nextCard.classList.contains('card')) {
                    nextCard.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowLeft') {
                const prevCard = activeCard.previousElementSibling;
                if (prevCard && prevCard.classList.contains('card')) {
                    prevCard.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

});

// --- 16. UTILITIES FOR FORM VALIDATION ---
function validateEmail(email) {
    const re = /^[^s@]+@[^s@]+\.[^s@]+$/;
    return re.test(email);
}

// --- 17. UTILITIES FOR PRICE FORMATTING ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// --- 18. UTILITIES FOR PERFORMANCE MONITORING ---
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    console.log('🚀 Page loaded successfully!');
});

// --- 19. UTILITIES FOR DARK MODE TOGGLE (OPTIONAL) ---
const toggleBtn = document.getElementById('toggle-theme');

if (toggleBtn) {
    const html = document.querySelector('html');
    
    toggleBtn.addEventListener('click', () => {
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// --- 20. UTILITIES FOR ACCESSIBILITY ---
const skipLink = document.createElement('a');
skipLink.href = '#main-content';
skipLink.className = 'skip-link';
skipLink.innerHTML = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstElementChild);

// Add skip link styles in CSS:
// .skip-link { position: absolute; top: -40px; left: 0; z-index: 9999; padding: 10px; background: var(--accent-blue); color: white; transition: top 0.3s; }
// .skip-link:focus { top: 0; }

console.log('🎨 Premium Apple Silicon Showcase Loaded!');
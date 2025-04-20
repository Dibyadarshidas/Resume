// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const skillFilterBtns = document.querySelectorAll('.skill-filters .filter-btn');
const projectFilterBtns = document.querySelectorAll('.project-filters .filter-btn');
const skillCards = document.querySelectorAll('.skill-card');
const projectCards = document.querySelectorAll('.project-card');
const topButton = document.getElementById('top-button');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');
const mainNav = document.querySelector('.main-nav');
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialDots = document.querySelectorAll('.dot');
const contactForm = document.getElementById('contactForm');
const offerBanner = document.querySelector('.limited-offer-banner');
const offerBtn = document.getElementById('offer-btn');
const closeOfferBtn = document.getElementById('close-offer');
const newsletterPopup = document.getElementById('newsletter-popup');

// Banner Functionality - appear every time unless user explicitly cancels
if (offerBanner && closeOfferBtn && offerBtn) {
    // Only check session storage, not local storage (so banner appears in new sessions)
    if (sessionStorage.getItem('offerBannerClosed')) {
        offerBanner.style.display = 'none';
    }
    
    // Handle close button click - store in sessionStorage (not localStorage)
    closeOfferBtn.addEventListener('click', function() {
        offerBanner.style.display = 'none';
        sessionStorage.setItem('offerBannerClosed', 'true');
    });
    
    // Handle offer button click
    offerBtn.addEventListener('click', function() {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth'
            });
            
            // Pre-fill subject with offer info
            const subjectField = document.querySelector('#subject');
            if (subjectField) {
                subjectField.value = "25% Discount Mentorship Inquiry";
            }
        }
    });
}

// Newsletter popup functionality - appear on scroll
if (newsletterPopup) {
    const closeNewsletterBtn = newsletterPopup.querySelector('.newsletter-close');
    const newsletterForm = newsletterPopup.querySelector('.newsletter-form');
    const newsletterSuccess = newsletterPopup.querySelector('.newsletter-success');
    let hasShownPopup = false;
    
    // Show popup when user has scrolled down
    window.addEventListener('scroll', function() {
        // Check if user has scrolled at least 60% down the page
        if (!hasShownPopup && !sessionStorage.getItem('newsletterClosed')) {
            const scrollPosition = window.scrollY;
            const pageHeight = document.body.scrollHeight - window.innerHeight;
            
            if (scrollPosition > pageHeight * 0.6) {
                newsletterPopup.classList.add('show');
                hasShownPopup = true;
            }
        }
    });
    
    // Close popup functionality
    if (closeNewsletterBtn) {
        closeNewsletterBtn.addEventListener('click', function() {
            newsletterPopup.classList.remove('show');
            sessionStorage.setItem('newsletterClosed', 'true');
        });
    }
    
    // Form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            newsletterForm.style.display = 'none';
            if (newsletterSuccess) {
                newsletterSuccess.classList.add('show');
            }
            
            // Close popup after 3 seconds
            setTimeout(function() {
                newsletterPopup.classList.remove('show');
                // Store in local storage so it doesn't show for returning visitors
                localStorage.setItem('newsletterSubscribed', 'true');
            }, 3000);
        });
    }
}

// Text Rotation Animation
class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }
    
    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];
        
        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
        
        this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;
        
        let delta = 200 - Math.random() * 100;
        
        if (this.isDeleting) { delta /= 2; }
        
        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }
        
        setTimeout(() => {
            this.tick();
        }, delta);
    }
}

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    
    if (document.body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu
    if (hamburgerMenu && navLinks) {
        // First, remove any existing close buttons to avoid duplicates
        const existingCloseBtn = navLinks.querySelector('.mobile-menu-close');
        if (existingCloseBtn) {
            existingCloseBtn.remove();
        }
        
        // Add a single close button to mobile menu
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Close menu');
        navLinks.prepend(closeBtn);
        
        // Toggle menu on hamburger click
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('hamburger-active');
            navLinks.classList.toggle('nav-active');
        });
        
        // Close menu when close button is clicked
        closeBtn.addEventListener('click', function() {
            hamburgerMenu.classList.remove('hamburger-active');
            navLinks.classList.remove('nav-active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('nav-active') && 
                !navLinks.contains(event.target) && 
                !hamburgerMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('hamburger-active');
                navLinks.classList.remove('nav-active');
            }
        });
        
        // Close menu when clicking on a menu item
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('hamburger-active');
                navLinks.classList.remove('nav-active');
            });
        });
    }
});

// Navigation scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        mainNav.classList.add('nav-scrolled');
    } else {
        mainNav.classList.remove('nav-scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Skills Filtering Functionality
skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        skillFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        skillCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Projects Filtering Functionality
projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        projectFilterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                if (card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
    });
});

// Testimonial Slider Functionality
let currentSlide = 0;

function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show the selected slide
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    
    currentSlide = index;
}

// Next slide button
testimonialNext.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
});

// Previous slide button
testimonialPrev.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
    showSlide(currentSlide);
});

// Dot navigation
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto slide change
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
}, 5000);

// Scroll to top functionality
topButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Handling with improved validation and animation
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Reset previous error states
        clearErrors();
        
        // Validate form
        let isValid = true;
        
        if (!name) {
            showError('name', 'Please enter your name');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!subject) {
            showError('subject', 'Please enter a subject');
            isValid = false;
        }
        
        if (!message) {
            showError('message', 'Please enter your message');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Log the form data (in a real app, this would be sent to a server)
                console.log('Form submitted:', { name, email, subject, message });
                
                // Hide the form and show success message
                const formElements = contactForm.querySelectorAll('.form-group, .form-row, .form-submit');
                formElements.forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                });
                
                setTimeout(() => {
                    formElements.forEach(el => {
                        el.style.display = 'none';
                    });
                    
                    // Show success message
                    const successMessage = contactForm.querySelector('.form-success');
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.opacity = '1';
                        successMessage.style.transform = 'translateY(0)';
                    }, 100);
                }, 300);
            }, 1500);
        }
    });
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Helper function to show error messages
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const inputContainer = input.closest('.input-with-icon');
        
        // Add error class
        inputContainer.classList.add('input-error');
        
        // Create and append error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        
        // Insert error message after the input container
        inputContainer.parentNode.insertBefore(errorMessage, inputContainer.nextSibling);
        
        // Add shake animation
        inputContainer.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            inputContainer.style.animation = '';
        }, 500);
    }
    
    // Helper function to clear all error messages
    function clearErrors() {
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.remove());
        
        const errorInputs = contactForm.querySelectorAll('.input-error');
        errorInputs.forEach(el => el.classList.remove('input-error'));
    }
    
    // Add event listeners to clear error when input changes
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const container = input.closest('.input-with-icon');
            if (container.classList.contains('input-error')) {
                container.classList.remove('input-error');
                const errorMessage = container.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            }
        });
    });
}

// Chart.js - Skills Chart
const ctx = document.getElementById('skillsChart');
if (ctx) {
    const skillsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Frontend', 'Backend', 'Design', 'DevOps', 'Integration', 'Tools'],
            datasets: [{
                label: 'Skill Level',
                data: [90, 80, 75, 78, 85, 88],
                backgroundColor: 'rgba(242, 104, 25, 0.2)',
                borderColor: 'rgba(242, 104, 25, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(242, 104, 25, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(242, 104, 25, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        color: document.body.classList.contains('light-theme') ? '#333' : '#fff',
                        font: {
                            size: 14,
                            family: "'Poppins', sans-serif",
                            weight: '600'
                        }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: document.body.classList.contains('light-theme') ? '#333' : '#fff',
                        font: {
                            size: 10
                        },
                        stepSize: 20
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: document.body.classList.contains('light-theme') ? '#333' : '#fff',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    },
                    position: window.innerWidth < 768 ? 'bottom' : 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 14,
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "'Poppins', sans-serif"
                    },
                    padding: 10,
                    cornerRadius: 5
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: window.innerWidth < 768 ? 1 : 2
        }
    });
    
    // Update chart on window resize
    window.addEventListener('resize', () => {
        skillsChart.options.plugins.legend.position = window.innerWidth < 768 ? 'bottom' : 'top';
        skillsChart.options.aspectRatio = window.innerWidth < 768 ? 1 : 2;
        skillsChart.update();
    });
    
    // Update chart colors when theme changes
    themeToggle.addEventListener('click', () => {
        const textColor = document.body.classList.contains('light-theme') ? '#333' : '#fff';
        
        skillsChart.options.scales.r.pointLabels.color = textColor;
        skillsChart.options.scales.r.ticks.color = textColor;
        skillsChart.options.plugins.legend.labels.color = textColor;
        
        skillsChart.update();
    });

    // Add animation to skill progress bars when scrolled into view
    const animateSkillBars = () => {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (barPosition < windowHeight - 50) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    };
    
    // Trigger the animation when the page loads
    window.addEventListener('load', animateSkillBars);
    
    // Re-trigger the animation when scrolling
    window.addEventListener('scroll', animateSkillBars);
}

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .project-card, .skill-card, .testimonial-content, .contact-container, .mentorship-card, .mentee-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Newsletter Popup
document.addEventListener('DOMContentLoaded', function() {
    const newsletterPopup = document.getElementById('newsletter-popup');
    const closeButton = document.querySelector('.newsletter-close');
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterSuccess = document.querySelector('.newsletter-success');
    
    // Show popup after 5 seconds
    setTimeout(() => {
        newsletterPopup.classList.add('show');
    }, 5000);
    
    // Close when clicking the close button
    closeButton.addEventListener('click', () => {
        newsletterPopup.classList.remove('show');
        // Set cookie to remember that user closed the popup
        setCookie('newsletter_closed', 'true', 7);
    });
    
    // Close when clicking outside the popup
    newsletterPopup.addEventListener('click', (e) => {
        if (e.target === newsletterPopup) {
            newsletterPopup.classList.remove('show');
            setCookie('newsletter_closed', 'true', 7);
        }
    });
    
    // Form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const nameInput = newsletterForm.querySelector('input[type="text"]');
        
        // Simple validation
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = 'red';
            return;
        }
        
        // Show success message
        newsletterForm.style.display = 'none';
        newsletterSuccess.classList.add('show');
        
        // Normally you would send the form data to your server here
        console.log('Newsletter signup:', {
            email: emailInput.value,
            name: nameInput.value
        });
        
        // Set cookie to not show popup again
        setCookie('newsletter_subscribed', 'true', 365);
        
        // Close popup after 3 seconds
        setTimeout(() => {
            newsletterPopup.classList.remove('show');
        }, 3000);
    });
    
    // Only show popup if user hasn't closed it before or already subscribed
    if (getCookie('newsletter_closed') === 'true' || getCookie('newsletter_subscribed') === 'true') {
        return;
    }
});

// Helper function to set cookies
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}

// Helper function to get cookies
function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Text Rotation
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    
    // INJECT CSS for text rotation
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid var(--primary-color) }";
    document.body.appendChild(css);
    
    // Set animation for elements
    const animElements = document.querySelectorAll('.card, .project-card, .skill-card, .testimonial-content, .contact-container, .mentorship-card, .mentee-card');
    animElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });
    
    // Trigger animation for visible elements
    setTimeout(animateOnScroll, 300);
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
    // Toggle chatbot visibility when clicking the floating button
    const chatbotToggleBtn = document.querySelector('.floating-cta-btn');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotCloseBtn = document.querySelector('.chatbot-close');
    
    if (chatbotToggleBtn && chatbotContainer && chatbotCloseBtn) {
        // Show chatbot when floating button is clicked
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
        });
        
        // Hide chatbot when close button is clicked
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Create chatbot instance with provider from config.js
    window.dibyChatbot = new DibyChatbot();
});

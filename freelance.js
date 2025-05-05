// Freelance page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme toggle
  initThemeToggle();
  
  // Initialize the testimonial slider
  initTestimonialSlider();
  
  // Initialize portfolio filters
  initPortfolioFilters();
  
  // Initialize FAQ accordions
  initFaqAccordions();
  
  // Handle contact form submission
  initContactForm();
  
  // Handle smooth scrolling for navigation
  initSmoothScrolling();
  
  // Initialize dynamic hero content
  initDynamicHeroContent();
  
  // Initialize CTA close functionality
  initCtaClose();
  
  // Make testimonials visible immediately
  const testimonialElements = document.querySelectorAll('.testimonial-card');
  testimonialElements.forEach(element => {
    element.classList.add('visible');
  });
});

// Initialize theme toggle
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  if (!themeToggle || !themeIcon) return;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    document.documentElement.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  
  // Add event listener for theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.documentElement.classList.toggle('light-theme');
    
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
}

// Dynamic Hero Content
function initDynamicHeroContent() {
  const headingElement = document.getElementById('dynamic-heading');
  const subheadingElement = document.getElementById('dynamic-subheading');
  const taglineElement = document.getElementById('dynamic-tagline');
  
  if (!headingElement || !subheadingElement || !taglineElement) return;
  
  // Define content variations
  const contentVariations = [
    {
      heading: "React + Next.js Development",
      subheading: "with SEO-Optimized Results",
      tagline: "Modern web applications that rank higher, load faster, and convert visitors into customers"
    },
    {
      heading: "AI Workflow Automation",
      subheading: "for Modern Businesses",
      tagline: "Harness the power of AI to automate processes, reduce costs, and drive business growth"
    },
    {
      heading: "Turn Your Vision Into Reality",
      subheading: "with Custom Web Solutions",
      tagline: "Bespoke development services tailored to your unique business requirements and goals"
    },
    {
      heading: "Build Intelligent Applications",
      subheading: "with AI-Powered Features",
      tagline: "Integrate cutting-edge AI technology into your web products to deliver exceptional user experiences"
    },
    {
      heading: "Boost Your Online Presence",
      subheading: "with Expert Frontend Development",
      tagline: "Engaging web experiences that captivate your audience and strengthen your brand identity"
    },
    {
      heading: "Streamline Your Operations",
      subheading: "with Custom AI Solutions",
      tagline: "Smart automation tools that save time, reduce errors, and help your team focus on what matters most"
    },
    {
      heading: "Craft Exceptional User Experiences",
      subheading: "that Drive Business Growth",
      tagline: "Intuitive interfaces and seamless interactions that keep your users coming back for more"
    },
    {
      heading: "Elevate Your Digital Strategy",
      subheading: "with Full-Stack Expertise",
      tagline: "End-to-end development services that transform ideas into powerful online solutions"
    }
  ];
  
  let currentIndex = 0;
  let isFirstRun = true;
  
  // Function to add typing effect
  function typeWriterEffect(element, text, speed = 30) {
    let i = 0;
    element.textContent = "";
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }
  
  // Function to update content with smooth transitions
  function updateHeroContent() {
    // No fade effect on the initial load to prevent conflict with the existing animations
    if (isFirstRun) {
      const content = contentVariations[currentIndex];
      headingElement.textContent = content.heading;
      subheadingElement.textContent = content.subheading;
      taglineElement.textContent = content.tagline;
      
      // Move to next content variation
      currentIndex = (currentIndex + 1) % contentVariations.length;
      isFirstRun = false;
      return;
    }
    
    // Fade out
    headingElement.style.opacity = '0';
    subheadingElement.style.opacity = '0';
    taglineElement.style.opacity = '0';
    headingElement.style.transform = 'translateY(-10px)';
    subheadingElement.style.transform = 'translateY(-10px)';
    
    // Update content after fade out
    setTimeout(() => {
      const content = contentVariations[currentIndex];
      
      headingElement.textContent = content.heading;
      subheadingElement.textContent = content.subheading;
      
      // Add highlight class
      headingElement.classList.add('highlight');
      subheadingElement.classList.add('highlight');
      
      // Fade in headings immediately
      headingElement.style.opacity = '1';
      subheadingElement.style.opacity = '1';
      headingElement.style.transform = 'translateY(0)';
      subheadingElement.style.transform = 'translateY(0)';
      
      // Prepare tagline for typing effect
      taglineElement.style.opacity = '1';
      
      // Apply typing effect to tagline
      typeWriterEffect(taglineElement, content.tagline);
      
      // Remove highlight after a delay
      setTimeout(() => {
        headingElement.classList.remove('highlight');
        subheadingElement.classList.remove('highlight');
      }, 1500);
      
      // Move to next content variation
      currentIndex = (currentIndex + 1) % contentVariations.length;
    }, 500);
  }
  
  // Set initial content
  updateHeroContent();
  
  // Start rotation after initial page load animations complete
  setTimeout(() => {
    setInterval(updateHeroContent, 7000);
  }, 3000);
}

// Testimonial Slider
function initTestimonialSlider() {
  console.log("Initializing testimonial slider");
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  console.log("Track element:", track);
  console.log("Number of slides:", slides.length);
  console.log("Number of dots:", dots.length);
  console.log("Previous button:", prevBtn);
  console.log("Next button:", nextBtn);
  
  // Debug: print the content of each testimonial to verify they're different
  slides.forEach((slide, index) => {
    const textContent = slide.querySelector('.testimonial-content p')?.textContent;
    const author = slide.querySelector('.author-info h4')?.textContent;
    console.log(`Slide ${index+1} content:`, textContent?.substring(0, 30) + '...');
    console.log(`Slide ${index+1} author:`, author);
  });
  
  if (!track || slides.length === 0) {
    console.error("Missing essential testimonial elements. Track or slides not found.");
    return;
  }
  
  // Reset any incorrect styles
  track.style.width = '300%'; // For 3 slides, each 100% width
  
  // Make each testimonial card a full width item
  slides.forEach((slide, index) => {
    slide.style.width = '33.333%'; // Each slide takes 1/3 of the track
    slide.style.minWidth = '33.333%';
    slide.style.boxSizing = 'border-box';
    slide.style.padding = '20px';
    
    // Reset any problematic styles
    const content = slide.querySelector('.testimonial-content');
    if (content) {
      content.style.width = '100%';
      content.style.maxWidth = '100%';
      content.style.boxSizing = 'border-box';
    }
  });
  
  let currentIndex = 0;
  
  // Reset any existing transform
  track.style.transform = 'translateX(0)';
  
  // Set initial position
  updateSlider();
  console.log("Initial slider position set");
  
  // Event listeners for controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      console.log("Previous button clicked");
      currentIndex = (currentIndex === 0) ? slides.length - 1 : currentIndex - 1;
      updateSlider();
    });
  } else {
    console.warn("Previous button not found");
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      console.log("Next button clicked");
      currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
      updateSlider();
    });
  } else {
    console.warn("Next button not found");
  }
  
  // Event listeners for dots
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        console.log("Dot clicked:", index);
        currentIndex = index;
        updateSlider();
      });
    });
  } else {
    console.warn("No dots found for testimonial navigation");
  }
  
  function updateSlider() {
    console.log("Updating slider to index:", currentIndex);
    
    // Calculate position - simply move by percentage based on current index
    const offset = currentIndex * 33.333; // 33.333% for each slide
    
    // Update track position
    track.style.transform = `translateX(-${offset}%)`;
    
    // Update active state for slides
    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.classList.add('active');
        slide.style.opacity = '1';
      } else {
        slide.classList.remove('active');
        slide.style.opacity = '0.7';
      }
    });
    
    // Update active dot
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  }
  
  // Auto slide
  console.log("Setting up auto slide");
  const autoSlideInterval = setInterval(() => {
    currentIndex = (currentIndex === slides.length - 1) ? 0 : currentIndex + 1;
    console.log("Auto-advancing to slide:", currentIndex);
    updateSlider();
  }, 5000);
  
  // Clear interval if the user navigates away
  window.addEventListener('beforeunload', () => {
    clearInterval(autoSlideInterval);
  });
}

// Portfolio Filters
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length === 0 || portfolioItems.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Filter items
      portfolioItems.forEach(item => {
        if (filterValue === 'all') {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          const categories = item.getAttribute('data-category').split(' ');
          
          if (categories.includes(filterValue)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 100);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
}

// FAQ Accordions
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Check if current item is active
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// Contact Form
function initContactForm() {
  const contactForm = document.getElementById('freelanceContactForm');
  const formSuccess = document.querySelector('.form-success');
  
  if (!contactForm || !formSuccess) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate form submission (replace with actual form handling)
    contactForm.style.display = 'none';
    formSuccess.style.display = 'block';
    
    // In a real implementation, you would:
    // 1. Collect form data
    // 2. Validate form data
    // 3. Submit using fetch or XMLHttpRequest
    // 4. Handle the response
    
    // Optional: Reset form after submission
    contactForm.reset();
    
    // For demonstration, we'll just show the success message
    console.log('Form submitted successfully!');
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      const hamburger = document.querySelector('.hamburger-menu');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('hamburger-active');
      }
      
      // Scroll to target
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });
  
  // Back to top button
  const topButton = document.getElementById('top-button');
  
  if (topButton) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        topButton.style.opacity = '1';
      } else {
        topButton.style.opacity = '0';
      }
    });
    
    topButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Animation on scroll
window.addEventListener('scroll', function() {
  const scrollPosition = window.pageYOffset;
  const windowHeight = window.innerHeight;
  
  // Animate elements when they come into view
  const animateElements = document.querySelectorAll('.section-header, .service-card, .process-step, .portfolio-item');
  
  animateElements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top + scrollPosition;
    
    if (scrollPosition + windowHeight > elementPosition + 100) {
      element.classList.add('visible');
    }
  });
});

// Wait until the page is fully loaded
window.addEventListener('load', function() {
  // Verify testimonial slider after a short delay
  setTimeout(() => {
    const track = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    console.log('======= TESTIMONIAL VERIFICATION =======');
    console.log('Track width:', track.style.width);
    
    testimonialCards.forEach((card, index) => {
      console.log(`Card ${index+1} width:`, card.style.width);
      console.log(`Card ${index+1} content:`, card.querySelector('.testimonial-content').textContent.trim().substring(0, 30) + '...');
    });
    
    // Force the correct styling if needed
    if (track.offsetWidth < 100 || !track.style.width.includes('300')) {
      console.log('Fixing track width');
      track.style.width = '300%';
    }
    
    testimonialCards.forEach((card, index) => {
      if (!card.style.width.includes('33.333')) {
        console.log(`Fixing card ${index+1} width`);
        card.style.width = '33.333%';
      }
    });
    
    console.log('Testimonial verification complete');
  }, 1000);
});

// Initialize CTA close functionality
function initCtaClose() {
  const ctaBanner = document.getElementById('sticky-cta');
  const closeButton = document.getElementById('close-cta');
  
  // Initially hide the banner
  if (ctaBanner) {
    ctaBanner.classList.add('hidden');
    
    // Show the banner after a short delay
    setTimeout(() => {
      ctaBanner.classList.remove('hidden');
    }, 1500); // 1.5 second delay
  }
  
  // Handle close button click
  if (closeButton && ctaBanner) {
    closeButton.addEventListener('click', () => {
      ctaBanner.classList.add('hidden');
      // We're not using localStorage anymore so the banner appears on every page reload
    });
  }
} 
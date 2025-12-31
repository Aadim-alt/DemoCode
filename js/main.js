/*
 =============================================================================
 MAIN JAVASCRIPT FILE - EcoMart E-Commerce Website
 =============================================================================
 
 JAVASCRIPT FEATURES IMPLEMENTED:
 -------------------------------
 1. Popup/Modal functionality for product details
 2. Dynamic content loading and manipulation
 3. Form validation with error handling
 4. Interactive navigation features
 5. Notification system
 6. Image slider functionality
 7. Dynamic data rendering

 =============================================================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('EcoMart Website Loaded Successfully');
    
    // Initialize all JavaScript features
    initModals();
    initFormValidation();
    initDynamicContent();
    initNotifications();
    initProductCards();
    initSearchFunctionality();
});

/*
 =============================================================================
 MODAL/POPUP FUNCTIONS
 =============================================================================
 */

// Store modal elements
let currentModal = null;

/**
 * Initialize all modal triggers
 * Shows popup when product cards are clicked
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Open a modal by ID
 * @param {string} modalId - The ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        currentModal = modal;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add fade-in animation
        modal.classList.add('fade-in');
    }
}

/**
 * Close a modal by ID
 * @param {string} modalId - The ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
        
        if (currentModal === modal) {
            currentModal = null;
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    }
}

/**
 * Close all open modals
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
        modal.classList.remove('fade-in');
    });
    currentModal = null;
    document.body.style.overflow = 'auto';
}

/**
 * Show product details in a modal
 * @param {object} product - Product object with details
 */
function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    if (modal) {
        // Update modal content dynamically
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <span class="modal-close" onclick="closeModal('productModal')">&times;</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 10px;">
                </div>
                <div>
                    <h2 style="color: #2d5a27; margin-bottom: 10px;">${product.name}</h2>
                    <p style="color: #666; margin-bottom: 15px;">${product.description}</p>
                    <div style="margin-bottom: 15px;">
                        <span style="text-decoration: line-through; color: #999;">$${product.originalPrice}</span>
                        <span style="color: #e74c3c; font-size: 1.5rem; font-weight: bold; margin-left: 10px;">$${product.price}</span>
                    </div>
                    <p style="margin-bottom: 20px;"><strong>Category:</strong> ${product.category}</p>
                    <button class="btn btn-primary" onclick="addToCart('${product.name}')">Add to Cart</button>
                </div>
            </div>
        `;
        openModal('productModal');
    }
}

/**
 * Show notification popup
 * @param {string} message - Message to display
 * @param {string} type - 'success' or 'error'
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

/*
 =============================================================================
 FORM VALIDATION FUNCTIONS
 =============================================================================
 */

let formErrors = [];

/**
 * Initialize form validation for all forms
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm(this)) {
                this.submit();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

/**
 * Validate entire form
 * @param {HTMLElement} form - Form element to validate
 * @returns {boolean} - Whether form is valid
 */
function validateForm(form) {
    formErrors = [];
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix all errors before submitting', 'error');
    } else {
        showNotification('Form validated successfully!', 'success');
    }
    
    return isValid;
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Field element to validate
 * @returns {boolean} - Whether field is valid
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Minimum length validation
    if (field.hasAttribute('data-minlength') && value) {
        const minLength = parseInt(field.getAttribute('data-minlength'));
        if (value.length < minLength) {
            isValid = false;
            errorMessage = `Minimum ${minLength} characters required`;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

/**
 * Show field error
 * @param {HTMLElement} field - Field element
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.color = '#e74c3c';
    error.style.fontSize = '0.85rem';
    error.style.display = 'block';
    error.style.marginTop = '5px';
    
    field.style.borderColor = '#e74c3c';
    field.parentNode.appendChild(error);
}

/**
 * Clear field error
 * @param {HTMLElement} field - Field element
 */
function clearFieldError(field) {
    field.style.borderColor = '#ddd';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Validate contact form specifically
 * @returns {boolean}
 */
function validateContactForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    
    let isValid = true;
    
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    }
    
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showFieldError(email, 'Valid email is required');
        isValid = false;
    }
    
    if (!subject.value.trim()) {
        showFieldError(subject, 'Subject is required');
        isValid = false;
    }
    
    if (!message.value.trim() || message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Submit contact form with AJAX
 */
function submitContactForm() {
    if (!validateContactForm()) {
        return false;
    }
    
    // Simulate form submission
    const formData = new FormData(document.getElementById('contactForm'));
    const data = Object.fromEntries(formData);
    
    console.log('Form submitted:', data);
    
    // Show success message
    showNotification('Thank you! Your message has been sent.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    return true;
}

/*
 =============================================================================
 DYNAMIC CONTENT FUNCTIONS
 =============================================================================
 */

/**
 * Initialize dynamic content features
 */
function initDynamicContent() {
    loadFeaturedProducts();
    loadBlogPosts();
    updateCartCount();
}

/**
 * Dynamic product data
 */
const products = [
    {
        id: 1,
        name: 'Bamboo Water Bottle',
        price: 24.99,
        originalPrice: 34.99,
        category: 'Bottles',
        description: 'Eco-friendly bamboo water bottle with double-wall insulation. Keeps drinks cold for 24 hours or hot for 12 hours.',
        image: 'img/Bicycle.png'
    },
    {
        id: 2,
        name: 'Organic Tote Bag',
        price: 19.99,
        originalPrice: 29.99,
        category: 'Bags',
        description: '100% organic cotton tote bag. Durable, washable, and perfect for groceries, books, and everyday use.',
        image: 'img/desk.png'
    },
    {
        id: 3,
        name: 'Natural Shampoo Bar',
        price: 12.99,
        originalPrice: 16.99,
        category: 'Bathroom',
        description: 'Zero-waste shampoo bar made with natural ingredients. Gentle on hair and scalp, lasts up to 80 washes.',
        image: 'img/shampoo.png'
    },
    {
        id: 4,
        name: 'Organic Body Lotion',
        price: 18.99,
        originalPrice: 24.99,
        category: 'Bathroom',
        description: 'Moisturizing body lotion with organic ingredients. Vegan, cruelty-free, and packaged in recyclable materials.',
        image: 'img/bodylotion.png'
    },
    {
        id: 5,
        name: 'Natural Soap Bar',
        price: 8.99,
        originalPrice: 12.99,
        category: 'Bathroom',
        description: 'Handmade natural soap with essential oils. No parabens, no sulfates, just pure goodness.',
        image: 'img/Soap.png'
    }
];

/**
 * Load featured products dynamically
 */
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 4);
    
    container.innerHTML = featured.map(product => `
        <div class="product-card" onclick="showProductDetails(${JSON.stringify(product).replace(/"/g, '"')})">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discounted-price">$${product.price}</span>
                </div>
                <p style="color: #666; font-size: 0.9rem;">${product.description.substring(0, 80)}...</p>
                <button class="btn btn-primary" style="margin-top: 10px; width: 100%;">View Details</button>
            </div>
        </div>
    `).join('');
}

/**
 * Load all products on products page
 */
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discounted-price">$${product.price}</span>
                </div>
                <p style="color: #666; font-size: 0.9rem;">${product.description}</p>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="showProductDetails(${JSON.stringify(product).replace(/"/g, '"')})">View Details</button>
                <button class="btn btn-secondary" style="margin-top: 10px;" onclick="addToCart('${product.name}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

/**
 * Filter products by category
 * @param {string} category - Category to filter by
 */
function filterProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = filtered.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="original-price">$${product.originalPrice}</span>
                    <span class="discounted-price">$${product.price}</span>
                </div>
                <p style="color: #666; font-size: 0.9rem;">${product.description}</p>
                <button class="btn btn-primary" style="margin-top: 10px;" onclick="showProductDetails(${JSON.stringify(product).replace(/"/g, '"')})">View Details</button>
                <button class="btn btn-secondary" style="margin-top: 10px;" onclick="addToCart('${product.name}')">Add to Cart</button>
            </div>
        </div>
    `).join('');
    
    showNotification(`Showing ${filtered.length} products in ${category}`, 'success');
}

/**
 * Blog post data
 */
const blogPosts = [
    {
        id: 1,
        title: 'How Technology is Transforming Sustainable Shopping',
        date: 'December 15, 2025',
        author: 'Sarah Johnson',
        image: 'img/Bicycle.png',
        excerpt: 'Explore how AI, blockchain, and IoT are revolutionizing the way we shop sustainably...',
        content: 'Technology is playing a crucial role in promoting sustainable consumption. From AI-powered product recommendations that help consumers make eco-friendly choices to blockchain technology ensuring supply chain transparency, digital innovations are making it easier than ever to shop responsibly. IoT devices can track the environmental footprint of products in real-time, while mobile apps provide instant access to sustainability ratings and certifications.'
    },
    {
        id: 2,
        title: 'The Rise of Green Tech in Daily Life',
        date: 'December 10, 2025',
        author: 'Michael Chen',
        image: 'img/desk.png',
        excerpt: 'Discover how smart devices are helping households reduce their carbon footprint...',
        content: 'Smart home technology has evolved to include numerous eco-friendly features. Intelligent thermostats learn your patterns and optimize energy usage, while smart plugs can automatically turn off devices when not in use. Solar-powered chargers and energy-efficient LED lighting systems controlled by mobile apps are becoming standard features in modern sustainable homes. These technologies not only reduce environmental impact but also result in significant cost savings.'
    },
    {
        id: 3,
        title: 'E-Commerce and the Future of Sustainable Business',
        date: 'December 5, 2025',
        author: 'Emily Rodriguez',
        image: 'img/shampoo.png',
        excerpt: 'Learn how online businesses are adapting to meet growing environmental demands...',
        content: 'The e-commerce industry is undergoing a green transformation. Companies are adopting sustainable packaging solutions, optimizing delivery routes using AI algorithms to reduce carbon emissions, and implementing circular economy models where products are designed for reuse and recycling. Virtual showrooms and digital product catalogs reduce the need for physical samples and printed materials, significantly lowering the overall environmental impact of online retail.'
    }
];

/**
 * Load blog posts dynamically
 */
function loadBlogPosts() {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    
    container.innerHTML = blogPosts.map(post => `
        <article class="blog-card">
            <img src="${post.image}" alt="${post.title}">
            <div class="blog-content">
                <div class="blog-meta">${post.date} | By ${post.author}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="readMore(${post.id})">Read More</button>
            </div>
        </article>
    `).join('');
}

/**
 * Read more blog post
 * @param {number} postId - ID of the post to read
 */
function readMore(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
        const modal = document.getElementById('blogModal');
        if (modal) {
            modal.querySelector('.modal-content').innerHTML = `
                <span class="modal-close" onclick="closeModal('blogModal')">&times;</span>
                <h2 style="color: #2d5a27; margin-bottom: 15px;">${post.title}</h2>
                <div class="blog-meta" style="margin-bottom: 20px;">${post.date} | By ${post.author}</div>
                <img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;">
                <p style="line-height: 1.8;">${post.content}</p>
            `;
            openModal('blogModal');
        }
    }
}

/*
 =============================================================================
 CART AND UTILITY FUNCTIONS
 =============================================================================
 */

let cart = [];

/**
 * Add item to cart
 * @param {string} productName - Name of product to add
 */
function addToCart(productName) {
    cart.push(productName);
    updateCartCount();
    showNotification(`${productName} added to cart!`, 'success');
}

/**
 * Update cart count display
 */
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

/**
 * Initialize product cards interactivity
 */
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * Newsletter subscription
 */
function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail');
    if (!email || !email.value) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showNotification('Thank you for subscribing!', 'success');
    email.value = '';
}

/*
 =============================================================================
 ANIMATION AND VISUAL EFFECTS
 =============================================================================
 */

/**
 * Add scroll animations to elements
 */
function addScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .blog-card, .category-card, .team-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

/**
 * Smooth scroll to section
 * @param {string} sectionId - ID of section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/*
 =============================================================================
 END OF MAIN JAVASCRIPT FILE
 =============================================================================
 */


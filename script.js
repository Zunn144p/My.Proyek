// Product Data - Computer & Networking
let products = [
    {
        id: 1,
        name: "Router WiFi 6 AX3000",
        price: 1200000,
        category: "networking",
        image: "📶",
        stock: 15,
        description: "Dual-band WiFi 6 router dengan kecepatan hingga 3000Mbps",
        sales: 45
    },
    {
        id: 2,
        name: "Switch 24 Port Gigabit",
        price: 2500000,
        category: "networking",
        image: "🔌",
        stock: 8,
        description: "Managed switch 24 port dengan fitur PoE",
        sales: 28
    },
    {
        id: 3,
        name: "CAT6 Ethernet Cable 10m",
        price: 85000,
        category: "networking",
        image: "🔗",
        stock: 5,
        description: "Kabel LAN CAT6 10 meter, shielded",
        sales: 120
    },
    {
        id: 4,
        name: "Gaming PC Ryzen 7",
        price: 18500000,
        category: "hardware",
        image: "💻",
        stock: 3,
        description: "PC Gaming dengan processor Ryzen 7 dan RTX 4070",
        sales: 12
    },
    {
        id: 5,
        name: "Mechanical Keyboard RGB",
        price: 750000,
        category: "accessories",
        image: "⌨️",
        stock: 20,
        description: "Mechanical keyboard dengan switch Blue dan RGB",
        sales: 67
    },
    {
        id: 6,
        name: "Wireless Mouse Gaming",
        price: 450000,
        category: "accessories",
        image: "🖱️",
        stock: 25,
        description: "Mouse gaming wireless dengan sensor 16000 DPI",
        sales: 89
    }
];

// Global variables
let cart = [];
let cartCount = 0;
let totalAmount = 0;
let currentUser = null;
let isDeveloper = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing App');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing application...');
    
    // Load products first
    loadProducts();
    
    // Initialize other components
    initNavigation();
    initCart();
    initCategoryFilters();
    initModals();
    initChatbot();
    initContactForm();
    
    // Update UI
    updateUserStatus();
    
    console.log('Application initialized successfully');
    console.log('Products loaded:', products.length);
}

// PERBAIKAN: Navigation yang benar
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Hamburger menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Navigation click handler
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                scrollToSection(targetId);
                
                // Update active states
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// PERBAIKAN: Scroll to section yang benar
function scrollToSection(sectionId) {
    console.log('Scrolling to section:', sectionId);
    
    // Hide developer dashboard if visible
    if (isDeveloper && sectionId !== 'developer-dashboard') {
        showMainInterface();
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
        // Remove active class from all sections
        document.querySelectorAll('.section').forEach(s => {
            s.classList.remove('active');
        });
        
        // Add active class to target section
        section.classList.add('active');
        
        // Smooth scroll
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
        
        console.log('Successfully scrolled to:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
}

// PERBAIKAN: Load products yang benar
function loadProducts(filterCategory = 'all') {
    console.log('Loading products, category:', filterCategory);
    
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) {
        console.error('Products grid not found!');
        return;
    }

    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);

    console.log('Filtered products:', filteredProducts.length);

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">Rp ${product.price.toLocaleString('id-ID')}</p>
            <p class="product-stock">Stock: ${product.stock}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})" 
                ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `).join('');

    console.log('Products rendered successfully');
}

// Login Functions
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function showDeveloperLogin() {
    document.getElementById('developer-login-form').classList.remove('hidden');
}

function loginAsUser() {
    currentUser = { type: 'user', name: 'User' };
    updateUserStatus();
    showNotification('Berhasil login sebagai User!', 'success');
    document.getElementById('login-modal').style.display = 'none';
}

function loginAsDeveloper() {
    const password = document.getElementById('dev-password').value;
    if (password === 'admin123') {
        currentUser = { type: 'developer', name: 'Developer' };
        isDeveloper = true;
        updateUserStatus();
        showDeveloperDashboard();
        showNotification('Akses Developer berhasil!', 'success');
        document.getElementById('login-modal').style.display = 'none';
    } else {
        showNotification('Password salah!', 'error');
    }
}

// PERBAIKAN: Show Developer Dashboard
function showDeveloperDashboard() {
    console.log('Showing developer dashboard');
    
    // Hide main content
    document.getElementById('main-content').classList.add('hidden');
    document.querySelector('footer').classList.add('hidden');
    
    // Show developer dashboard
    document.getElementById('developer-dashboard').classList.remove('hidden');
    
    // Load developer data
    loadDevProducts();
    loadLowStockAlerts();
    updateAnalytics();
    
    console.log('Developer dashboard shown');
}

// PERBAIKAN: Kembali ke main interface
function logout() {
    currentUser = null;
    isDeveloper = false;
    updateUserStatus();
    showMainInterface();
    showNotification('Berhasil logout!', 'success');
}

function showMainInterface() {
    console.log('Showing main interface');
    
    // Hide developer dashboard
    document.getElementById('developer-dashboard').classList.add('hidden');
    
    // Show main content and footer
    document.getElementById('main-content').classList.remove('hidden');
    document.querySelector('footer').classList.remove('hidden');
    
    // Reset to home section
    scrollToSection('home');
    
    console.log('Main interface shown');
}

function updateUserStatus() {
    const userMenu = document.querySelector('.user-menu span');
    if (currentUser) {
        userMenu.textContent = currentUser.name;
        userMenu.style.color = '#4fc3f7';
    } else {
        userMenu.textContent = 'Guest';
        userMenu.style.color = '#e0f7fa';
    }
}

// Developer Functions
function showDevSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.dev-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.dev-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`dev-${sectionName}`).classList.add('active');
    
    // Activate menu item
    document.querySelector(`[href="#dev-${sectionName}"]`).classList.add('active');
}

function loadDevProducts() {
    const devProductsGrid = document.querySelector('.dev-products-grid');
    if (!devProductsGrid) {
        console.error('Dev products grid not found');
        return;
    }
    
    console.log('Loading dev products:', products.length);
    
    devProductsGrid.innerHTML = products.map(product => `
        <div class="dev-product-card" data-product-id="${product.id}">
            <div class="dev-product-header">
                <div class="dev-product-info">
                    <h4>${product.name}</h4>
                    <div class="dev-product-category">${getCategoryName(product.category)}</div>
                </div>
                <div class="dev-product-actions">
                    <button class="dev-action-btn" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            <div class="dev-product-details">
                <div class="dev-product-emoji">${product.image}</div>
                <div class="dev-product-stats">
                    <div class="dev-product-price">
                        <span>Price:</span>
                        <strong>Rp ${product.price.toLocaleString('id-ID')}</strong>
                    </div>
                    <div class="dev-product-stock">
                        <span>Stock:</span>
                        <strong>${product.stock} units</strong>
                    </div>
                    <div class="dev-product-sales">
                        <span>Sales:</span>
                        <strong>${product.sales || 0} sold</strong>
                    </div>
                </div>
            </div>
            <p class="dev-product-description">${product.description}</p>
            <div class="dev-product-controls">
                <div class="control-group">
                    <label>Update Price</label>
                    <input type="number" class="control-input price-input" value="${product.price}" 
                           onchange="updateProductPrice(${product.id}, this.value)">
                </div>
                <div class="control-group">
                    <label>Update Stock</label>
                    <input type="number" class="control-input stock-input" value="${product.stock}" 
                           onchange="updateProductStock(${product.id}, this.value)">
                </div>
                <button class="update-btn" onclick="saveProductChanges(${product.id})">
                    <i class="fas fa-save"></i> Save
                </button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function loadLowStockAlerts() {
    const alertList = document.querySelector('.alert-list');
    if (!alertList) return;
    
    const lowStockProducts = products.filter(product => product.stock < 10);
    
    if (lowStockProducts.length === 0) {
        alertList.innerHTML = '<p class="no-alerts">No low stock alerts</p>';
        return;
    }
    
    alertList.innerHTML = lowStockProducts.map(product => `
        <div class="alert-item ${product.stock < 5 ? 'critical' : ''}">
            <div class="alert-info">
                <strong>${product.name}</strong>
                <span>${getCategoryName(product.category)}</span>
            </div>
            <div class="alert-stock">
                <span class="stock-count">${product.stock} units left</span>
                <button class="dev-action-btn" onclick="focusProduct(${product.id})">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateAnalytics() {
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-sales').textContent = products.reduce((total, product) => total + (product.sales || 0), 0);
    document.getElementById('low-stock-count').textContent = products.filter(p => p.stock < 10).length;
}

// Product Management Functions
function updateProductPrice(productId, newPrice) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.newPrice = parseInt(newPrice);
    }
}

function updateProductStock(productId, newStock) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.newStock = parseInt(newStock);
    }
}

function saveProductChanges(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        if (product.newPrice !== undefined) {
            product.price = product.newPrice;
            delete product.newPrice;
        }
        if (product.newStock !== undefined) {
            product.stock = product.newStock;
            delete product.newStock;
        }
        
        showNotification('Produk berhasil diperbarui!', 'success');
        loadDevProducts();
        loadProducts(); // Update main products view
        loadLowStockAlerts();
        updateAnalytics();
        updateRecommendedProducts();
    }
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== productId);
        showNotification('Produk berhasil dihapus!', 'success');
        loadDevProducts();
        loadProducts();
        updateAnalytics();
        updateRecommendedProducts();
    }
}

// Modal Functions
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1,
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            price: parseInt(document.getElementById('product-price').value),
            stock: parseInt(document.getElementById('product-stock').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-emoji').value,
            sales: 0
        };
        
        products.push(newProduct);
        showNotification('Produk berhasil ditambahkan!', 'success');
        closeAddProductModal();
        loadDevProducts();
        loadProducts();
        updateAnalytics();
        updateRecommendedProducts();
    });
}

function showAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'none';
    document.getElementById('add-product-form').reset();
}

// Cart Functions (tetap sama)
function initCart() {
    updateCartDisplay();
    const savedCart = localStorage.getItem('techsphere-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            showNotification('Stok tidak mencukupi!', 'error');
            return;
        }
        existingItem.quantity++;
    } else {
        if (product.stock === 0) {
            showNotification('Produk habis!', 'error');
            return;
        }
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Produk dihapus dari keranjang!', 'warning');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            const product = products.find(p => p.id === productId);
            if (item.quantity > product.stock) {
                item.quantity = product.stock;
                showNotification('Stok tidak mencukupi!', 'error');
            }
            updateCart();
        }
    }
}

function updateCart() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    localStorage.setItem('techsphere-cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    const cartItemsElement = document.querySelector('.cart-items');
    const totalAmountElement = document.querySelector('.total-amount');
    
    cartCountElement.textContent = cartCount;
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang kosong</p>
            </div>
        `;
    } else {
        cartItemsElement.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    totalAmountElement.textContent = totalAmount.toLocaleString('id-ID');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang kosong!', 'error');
        return;
    }
    
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.sales = (product.sales || 0) + cartItem.quantity;
            product.stock -= cartItem.quantity;
        }
    });
    
    showNotification('Checkout berhasil! Pesanan sedang diproses.', 'success');
    cart = [];
    updateCart();
    localStorage.removeItem('techsphere-cart');
    loadProducts();
    if (isDeveloper) {
        loadDevProducts();
        loadLowStockAlerts();
        updateAnalytics();
    }
    updateRecommendedProducts();
}

// Category Filters
function initCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });
}

// Chatbot Functions
function initChatbot() {
    const toggleBtn = document.querySelector('.chatbot-toggle');
    const closeBtn = document.querySelector('.close-chatbot');
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input');
    
    toggleBtn.addEventListener('click', function() {
        document.querySelector('.chatbot-container').classList.toggle('active');
        updateRecommendedProducts();
    });
    
    closeBtn.addEventListener('click', function() {
        document.querySelector('.chatbot-container').classList.remove('active');
    });
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    updateRecommendedProducts();
}

function updateRecommendedProducts() {
    const recommendedContainer = document.querySelector('.recommended-products');
    if (!recommendedContainer) return;
    
    const bestSellers = [...products]
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 3);
    
    recommendedContainer.innerHTML = bestSellers.map(product => `
        <div class="recommended-product" onclick="scrollToProduct('${product.category}', ${product.id})">
            <div class="product-emoji">${product.image}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
            </div>
        </div>
    `).join('');
}

function scrollToProduct(category, productId) {
    scrollToSection('products');
    
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    loadProducts(category);
    
    document.querySelector('.chatbot-container').classList.remove('active');
    
    setTimeout(() => {
        const productCard = document.querySelector(`[data-product-id="${productId}"]`);
        if (productCard) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 1000);
}

function sendMessage() {
    const chatInput = document.querySelector('.chat-input');
    const message = chatInput.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        
        setTimeout(() => {
            let response = "Maaf, saya tidak mengerti pertanyaan Anda. ";
            response += "Silakan tanyakan tentang produk kami atau klik rekomendasi di atas.";
            
            if (message.toLowerCase().includes('harga') || message.toLowerCase().includes('price')) {
                response = "Berikut informasi harga produk kami:\n";
                products.slice(0, 3).forEach(product => {
                    response += `• ${product.name}: Rp ${product.price.toLocaleString('id-ID')}\n`;
                });
            } else if (message.toLowerCase().includes('stok') || message.toLowerCase().includes('stock')) {
                response = "Berikut informasi stok produk:\n";
                products.slice(0, 3).forEach(product => {
                    response += `• ${product.name}: ${product.stock} unit\n`;
                });
            }
            
            addMessage(response, 'bot');
        }, 1000);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    
    if (sender === 'user') {
        messageDiv.style.alignSelf = 'flex-end';
        messageDiv.style.background = 'rgba(79, 195, 247, 0.2)';
    }
    
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Utility Functions
function getCategoryName(category) {
    const categories = {
        'hardware': 'Hardware',
        'networking': 'Networking',
        'accessories': 'Accessories'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(45deg, #e53935, #f44336)' : 
                     type === 'warning' ? 'linear-gradient(45deg, #ff9800, #ff5722)' : 
                     'linear-gradient(45deg, #4fc3f7, #29b6f6)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
            this.reset();
        });
    }
}

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.scrollToSection = scrollToSection;
window.checkout = checkout;
window.showLoginModal = showLoginModal;
window.loginAsUser = loginAsUser;
window.showDeveloperLogin = showDeveloperLogin;
window.loginAsDeveloper = loginAsDeveloper;
window.logout = logout;
window.showDevSection = showDevSection;
window.showAddProductModal = showAddProductModal;
window.closeAddProductModal = closeAddProductModal;
window.updateProductPrice = updateProductPrice;
window.updateProductStock = updateProductStock;
window.saveProductChanges = saveProductChanges;
window.deleteProduct = deleteProduct;
window.focusProduct = focusProduct;
window.scrollToProduct = scrollToProduct;
window.sendMessage = sendMessage;

console.log('Script loaded successfully');

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Smooth Animasi Scroll dengan Intersection Observer
    const animatedElements = document.querySelectorAll('.product-card, .about-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop setelah animasi
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));

    // Navbar Mobile Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active'); // Tambah CSS untuk .active { display: flex; flex-direction: column; }
    });

    // Tambah ke Keranjang (Sederhana - Alert, expand ke localStorage nanti)
    const buyButtons = document.querySelectorAll('.btn-buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productName = e.target.parentElement.querySelector('h3').textContent;
            alert(`${productName} ditambahkan ke keranjang!`); // Ganti dengan cart logic real
        });
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});

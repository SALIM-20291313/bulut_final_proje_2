const API_URL = 'http://ETicaret-ALB-1841145485.us-east-1.elb.amazonaws.com/api';

// State
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');
let userId = localStorage.getItem('userId');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = '';
let currentSearch = '';

// Elements
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementById('close-modal');
const tabBtns = document.querySelectorAll('.modal-header .tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const productsContainer = document.getElementById('products-container');
const cartContainer = document.getElementById('cart-container');
const ordersContainer = document.getElementById('orders-container');
const cartBadge = document.getElementById('cart-badge');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();
    fetchProducts();
    
    // Sayfa ilk açıldığında URL'deki hash'e göre sekmeyi aç
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showTab(hash, false);
    }
});

// Toast Notification System
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Navigation Tabs
window.showTab = function(tabId, updateHash = true) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    
    if (tabId === 'orders-tab') fetchOrders();

    // Tarayıcı geri/ileri butonları için Hash Routing (file:// destekler)
    if (updateHash) {
        if (window.location.hash !== `#${tabId}`) {
            window.location.hash = tabId;
        }
    }
};

// Tarayıcı oklarına (Geri/İleri) basıldığında çalışır
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showTab(hash, false);
    } else {
        showTab('products-tab', false);
    }
});

// Auth UI
function updateAuthUI() {
    if (token && username) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-menu').style.display = 'inline-block';
        document.getElementById('user-greeting').textContent = username;
    } else {
        document.getElementById('login-btn').style.display = 'inline-block';
        document.getElementById('user-menu').style.display = 'none';
    }
}

document.getElementById('login-btn').addEventListener('click', () => authModal.classList.add('active'));
closeModal.addEventListener('click', () => authModal.classList.remove('active'));

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
    });
});

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    token = null; username = null; userId = null;
    cart = [];
    updateAuthUI();
    updateCartUI();
    showTab('products-tab');
    showToast('Çıkış yapıldı.');
});

// Search & Filter
document.getElementById('search-btn').addEventListener('click', () => {
    currentSearch = document.getElementById('search-input').value;
    fetchProducts();
});
document.getElementById('search-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        currentSearch = e.target.value;
        fetchProducts();
    }
});

window.filterCategory = function(category) {
    currentCategory = category;
    document.querySelectorAll('.category-list li').forEach(li => {
        li.classList.remove('active');
        if ((category === '' && li.textContent === 'Tümü') || li.textContent === category) {
            li.classList.add('active');
        }
    });
    fetchProducts();
};

// Fetch Products
async function fetchProducts() {
    productsContainer.innerHTML = '<div class="loader">Yükleniyor...</div>';
    try {
        let url = `${API_URL}/products?`;
        if (currentCategory) url += `category=${encodeURIComponent(currentCategory)}&`;
        if (currentSearch) url += `search=${encodeURIComponent(currentSearch)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ürünler getirilemedi.');
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        productsContainer.innerHTML = `<p style="color: var(--danger);">Hata: Backend sunucusuna bağlanılamadı.</p>`;
    }
}

function getCategoryEmoji(cat) {
    const map = { 'Teknoloji': '💻', 'Giyim': '👕', 'Gıda': '🍎', 'Oyuncak': '🧸', 'Spor': '⚽' };
    return map[cat] || '🛍️';
}

function renderProducts(products) {
    if (products.length === 0) {
        productsContainer.innerHTML = `<p>Aradığınız kriterlere uygun ürün bulunamadı.</p>`;
        return;
    }

    productsContainer.innerHTML = products.map(p => {
        const emoji = getCategoryEmoji(p.category);
        const fallbackSvg = `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><rect width='500' height='500' fill='%230d1117'/><text x='50%25' y='44%25' dominant-baseline='middle' text-anchor='middle' font-size='120'>${emoji}</text><text x='50%25' y='68%25' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='%2358a6ff' font-family='sans-serif'>${encodeURIComponent(p.category)}</text></svg>`;
        return `
        <div class="product-card">
            <img src="${p.image_url}" alt="${p.name}" class="product-img" onerror="this.onerror=null;this.src='${fallbackSvg}'">
            <div class="product-category">${p.category}</div>
            <h3 class="product-title">${p.name}</h3>
            <p class="product-desc">${p.description}</p>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">Stok: ${p.stock > 0 ? p.stock : '<span style="color:var(--danger)">Tükendi</span>'}</div>
            <div class="product-footer">
                <span class="product-price">${p.price} ₺</span>
                <button class="btn-outline" ${p.stock === 0 ? 'disabled' : ''} onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image_url}')">
                    <i class="fa-solid fa-cart-plus"></i> Sepete Ekle
                </button>
            </div>
        </div>
    `}).join('');
}

// Cart System
window.addToCart = function(id, name, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    showToast(`${name} sepete eklendi!`);
};

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Sepetiniz boş.</p>';
        document.getElementById('cart-subtotal').textContent = '0 ₺';
        document.getElementById('cart-total').textContent = '0 ₺';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }
    
    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} ₺ x ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-danger" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `}).join('');
    
    document.getElementById('cart-subtotal').textContent = `${total} ₺`;
    document.getElementById('cart-total').textContent = `${total} ₺`;
    document.getElementById('checkout-btn').disabled = false;
}

// Checkout
document.getElementById('checkout-btn').addEventListener('click', async () => {
    if (!token) {
        authModal.classList.add('active');
        showToast('Satın almak için giriş yapmalısınız.', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const products = cart.map(c => ({ productId: c.id, quantity: c.quantity, price: c.price }));
    
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ products, total_price: total })
        });
        
        const data = await res.json();
        if (res.ok) {
            cart = [];
            saveCart();
            showToast('Siparişiniz başarıyla oluşturuldu!');
            showTab('orders-tab');
            fetchProducts(); // Refresh stock
        } else {
            showToast(data.error, 'error');
        }
    } catch (err) {
        showToast('Sipariş işlemi başarısız.', 'error');
    }
});

// Fetch Orders
async function fetchOrders() {
    if (!token) return;
    ordersContainer.innerHTML = '<div class="loader">Yükleniyor...</div>';
    
    try {
        const res = await fetch(`${API_URL}/orders/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>Henüz hiç siparişiniz yok.</p>';
            return;
        }
        
        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-date">${new Date(order.createdAt).toLocaleString()}</span>
                    <span class="order-status">${order.status}</span>
                </div>
                <ul class="order-product-list">
                    ${order.products.map(p => `
                        <li>
                            <span>${p.productId ? p.productId.name : 'Silinmiş Ürün'} (x${p.quantity})</span>
                            <span>${p.price * p.quantity} ₺</span>
                        </li>
                    `).join('')}
                </ul>
                <div style="text-align: right; margin-top: 1rem; font-weight: bold;">
                    Toplam: <span style="color: var(--primary-color)">${order.total_price} ₺</span>
                </div>
            </div>
        `).join('');
    } catch (err) {
        ordersContainer.innerHTML = '<p>Siparişler getirilemedi.</p>';
    }
}

// Admin Add Product
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!token) return showToast('Giriş yapmalısınız', 'error');
    
    const body = {
        name: document.getElementById('admin-name').value,
        description: document.getElementById('admin-desc').value,
        price: Number(document.getElementById('admin-price').value),
        image_url: document.getElementById('admin-image').value,
        category: document.getElementById('admin-category').value,
        stock: Number(document.getElementById('admin-stock').value)
    };
    
    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        
        if (res.ok) {
            showToast('Ürün başarıyla eklendi!');
            e.target.reset();
            fetchProducts();
        } else {
            showToast((await res.json()).error, 'error');
        }
    } catch (err) {
        showToast('Ürün eklenemedi', 'error');
    }
});

// Auth Forms
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            token = data.token; username = data.username; userId = data.id;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            
            authModal.classList.remove('active');
            updateAuthUI();
            showToast('Başarıyla giriş yapıldı!');
        } else {
            document.getElementById('login-error').textContent = data.error;
        }
    } catch (err) {
        document.getElementById('login-error').textContent = 'Bağlantı hatası.';
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            showToast('Kayıt başarılı! Lütfen giriş yapın.');
            document.querySelector('.tab-btn[data-tab="login"]').click();
        } else {
            document.getElementById('reg-error').textContent = data.error;
        }
    } catch (err) {
        document.getElementById('reg-error').textContent = 'Bağlantı hatası.';
    }
});

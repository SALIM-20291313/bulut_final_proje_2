const API_URL = 'http://ETicaret-ALB-1841145485.us-east-1.elb.amazonaws.com/api'; // Local test URL

// State
let token = localStorage.getItem('token');
let username = localStorage.getItem('username');
let userId = localStorage.getItem('userId');

// Elements
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const userGreeting = document.getElementById('user-greeting');
const authModal = document.getElementById('auth-modal');
const closeModal = document.getElementById('close-modal');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const productsContainer = document.getElementById('products-container');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    fetchProducts();
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    authModal.classList.remove('active');
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    token = null;
    username = null;
    userId = null;
    updateAuthUI();
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        authForms.forEach(f => f.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}-form`).classList.add('active');
    });
});

// Authentication UI
function updateAuthUI() {
    if (token && username) {
        loginLink.style.display = 'none';
        userGreeting.style.display = 'inline';
        userGreeting.textContent = `Merhaba, ${username}`;
        logoutLink.style.display = 'inline-block';
    } else {
        loginLink.style.display = 'inline-block';
        userGreeting.style.display = 'none';
        logoutLink.style.display = 'none';
    }
}

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Ürünler getirilemedi.');
        
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        productsContainer.innerHTML = `<p style="text-align:center; color: #ff7b72; grid-column: 1 / -1;">Hata: Backend sunucusuna bağlanılamadı. API'nin (PORT 5000) çalıştığından emin olun.</p>`;
    }
}

function renderProducts(products) {
    if (products.length === 0) {
        productsContainer.innerHTML = `<p style="text-align:center; grid-column: 1 / -1;">Henüz ürün bulunmamaktadır.</p>`;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-img">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${product.price} ₺</span>
                <button class="btn-primary" onclick="buyProduct('${product.id}', ${product.price})">Satın Al</button>
            </div>
        </div>
    `).join('');
}

// Purchase function
async function buyProduct(productId, price) {
    if (!token) {
        authModal.classList.add('active');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ user_id: userId, total_price: price })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); 
        } else {
            alert(`Hata: ${data.error}`);
        }
    } catch (error) {
        alert('Sipariş işlemi sırasında bir hata oluştu.');
    }
}

// Forms Submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            token = data.token;
            username = data.username;
            userId = data.id;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            
            authModal.classList.remove('active');
            updateAuthUI();
            errorMsg.textContent = '';
        } else {
            errorMsg.textContent = data.error;
        }
    } catch (err) {
        errorMsg.textContent = 'Bağlantı hatası.';
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorMsg = document.getElementById('reg-error');
    
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, email, password })
        });
        
        const data = await res.json();
        if (res.ok) {
            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            document.querySelector('[data-tab="login"]').click(); // Switch to login tab
        } else {
            errorMsg.textContent = data.error;
        }
    } catch (err) {
        errorMsg.textContent = 'Bağlantı hatası.';
    }
});

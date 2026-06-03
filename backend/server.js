require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { User, Product, Order } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanına bağlan
connectDB();

// Middleware: JWT Doğrulama
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Erişim reddedildi, token bulunamadı." });
    
    jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar', (err, user) => {
        if (err) return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
        req.user = user;
        next();
    });
};

// 1. Register API
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Bu e-posta zaten kullanımda." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        
        res.json({ message: "Kullanıcı başarıyla oluşturuldu.", user: { id: newUser._id, username: newUser.username } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Sunucu hatası." });
    }
});

// 2. Login API
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Geçersiz e-posta veya şifre." });
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'gizli_anahtar', { expiresIn: '1h' });
        res.json({ token, username: user.username, id: user._id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Sunucu hatası" });
    }
});

// 3. Get Products API
app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };
        
        const allProducts = await Product.find(query);
        const formattedProducts = allProducts.map(p => ({
            id: p._id.toString(),
            name: p.name,
            description: p.description,
            price: p.price,
            image_url: p.image_url,
            category: p.category,
            stock: p.stock
        }));
        res.json(formattedProducts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Sunucu hatası, ürünler getirilemedi." });
    }
});

// 4. Create Order API (Protected)
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { products, total_price } = req.body;
        
        // Stok kontrolü ve düşürme
        for (let item of products) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `${product ? product.name : 'Bilinmeyen Ürün'} için yeterli stok yok!` });
            }
            product.stock -= item.quantity;
            await product.save();
        }
        
        const newOrder = await Order.create({
            userId: req.user.id,
            products,
            total_price
        });
        
        res.json({ message: "Siparişiniz başarıyla alındı!", order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Sipariş oluşturulurken bir hata oluştu." });
    }
});

// 5. Get My Orders API (Protected)
app.get('/api/orders/me', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products.productId').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Siparişler getirilemedi." });
    }
});

// 6. Admin: Add Product API (Protected - Normally requires admin role)
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, image_url, category, stock } = req.body;
        const newProduct = await Product.create({ name, description, price, image_url, category, stock });
        res.json({ message: "Ürün başarıyla eklendi!", product: newProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Ürün eklenirken hata oluştu." });
    }
});

// Health Check for AWS ELB Target Group
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`E-Ticaret Backend API (MongoDB) çalışıyor. Port: ${PORT}`);
});

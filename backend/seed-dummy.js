const mongoose = require('mongoose');
require('dotenv').config();
const { Product } = require('./models');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Fetch real products from DummyJSON
        const response = await fetch('https://dummyjson.com/products?limit=15');
        const data = await response.json();
        
        const mappedProducts = data.products.map(p => ({
            name: p.title,
            description: p.description,
            price: Math.round(p.price * 30), // Convert to roughly TRY
            image_url: p.images[0],
            category: p.category === 'beauty' ? 'Kozmetik' : (p.category === 'fragrances' ? 'Parfüm' : (p.category.includes('mens') ? 'Giyim' : 'Teknoloji')),
            stock: p.stock
        }));

        await Product.deleteMany({});
        await Product.insertMany(mappedProducts);
        
        console.log("DummyJSON ürünleri MongoDB'ye başarıyla eklendi! Toplam: " + mappedProducts.length);
        process.exit();
    } catch (error) {
        console.error("Veri eklenirken hata oluştu:", error.message);
        process.exit(1);
    }
};

seedDB();

const mongoose = require('mongoose');
require('dotenv').config();
const { Product } = require('./models');

const products = [
    {
        name: 'Bulut Mimarisi T-Shirt',
        description: 'Modern ve rahat %100 pamuklu, AWS logo detaylı tişört.',
        price: 250.00,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        stock: 50
    },
    {
        name: 'Server Kupa Bardak',
        description: 'Bitmeyen kodlama seansları için büyük boy kahve kupası.',
        price: 120.00,
        image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        stock: 100
    },
    {
        name: 'DevOps Hoodie',
        description: 'Soğuk ofis günlerinde sıcak tutan premium hoodie.',
        price: 550.00,
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        stock: 30
    },
    {
        name: 'Cloud Native Şapka',
        description: 'Güneşli günlerde dışarıda çalışırken kodlamaya devam et.',
        price: 150.00,
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        stock: 20
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await Product.deleteMany({});
        await Product.insertMany(products);
        
        console.log("Örnek ürünler MongoDB'ye başarıyla eklendi!");
        process.exit();
    } catch (error) {
        console.error("Veri eklenirken hata oluştu:", error.message);
        process.exit(1);
    }
};

seedDB();

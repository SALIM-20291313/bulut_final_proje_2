const mongoose = require('mongoose');
require('dotenv').config();
const { Product } = require('./models');

const products = [
    // --- GİYİM ---
    {
        name: 'AWS Bulut Mimarisi T-Shirt',
        description: 'Modern ve rahat %100 pamuklu, AWS logo detaylı tişört.',
        price: 250.00,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 50
    },
    {
        name: 'DevOps Kışlık Hoodie',
        description: 'Soğuk ofis günlerinde sıcak tutan premium kapüşonlu.',
        price: 550.00,
        image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 30
    },
    {
        name: 'Cloud Native Yazlık Şapka',
        description: 'Güneşli günlerde dışarıda çalışırken kodlamaya devam et.',
        price: 150.00,
        image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 20
    },
    {
        name: 'Python Developer Çorap',
        description: 'Böceklerden (bug) uzak tutan şanslı yazılımcı çorabı.',
        price: 60.00,
        image_url: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 100
    },
    
    // --- TEKNOLOJİ ---
    {
        name: 'Mekanik Klavye (Red Switch)',
        description: 'Sessiz ve hızlı tepki veren, RGB aydınlatmalı premium klavye.',
        price: 1250.00,
        image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 15
    },
    {
        name: 'Gürültü Engelleyici Kulaklık',
        description: 'Açık ofis ortamlarında odaklanmak için birebir.',
        price: 2400.00,
        image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 8
    },
    {
        name: 'Çift Monitör Standı',
        description: 'Masa düzenini sağlayan, alüminyum alaşımlı 360 derece dönebilen stand.',
        price: 850.00,
        image_url: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 25
    },

    // --- AKSESUAR ---
    {
        name: 'Server Kupa Bardak',
        description: 'Bitmeyen kodlama seansları için büyük boy kahve kupası.',
        price: 120.00,
        image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Aksesuar',
        stock: 100
    },
    {
        name: 'Ergonomik Mouse Pad',
        description: 'Bilek destekli, masayı tam kaplayan geniş yüzeyli mouse pad.',
        price: 180.00,
        image_url: 'https://images.unsplash.com/photo-1527814050087-379381547961?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Aksesuar',
        stock: 45
    },
    {
        name: 'Kablo Toplayıcı Organizer',
        description: 'Masanızdaki kablo karmaşasına son veren şık çözüm.',
        price: 85.00,
        image_url: 'https://images.unsplash.com/photo-1620608518974-9464b9015975?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Aksesuar',
        stock: 200
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

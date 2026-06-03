const mongoose = require('mongoose');
require('dotenv').config();
const { Product } = require('./models');

const products = [
    // --- GİYİM ---
    {
        name: 'Erkek Günlük T-Shirt',
        description: 'Modern ve rahat %100 pamuklu, nefes alabilen kumaş.',
        price: 250.00,
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 500
    },
    {
        name: 'Slim Fit Erkek Tişört',
        description: 'Vücudu saran özel kesim, spor ve günlük kullanım.',
        price: 350.00,
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 300
    },
    {
        name: 'Pamuklu Kışlık Ceket',
        description: 'Soğuk günlerde içinizi ısıtacak kalın yapılı ceket.',
        price: 850.00,
        image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 200
    },
    {
        name: 'Slim Fit Klasik Gömlek',
        description: 'Özel günler veya ofis için ütü gerektirmeyen gömlek.',
        price: 460.00,
        image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 1000
    },
    {
        name: 'Gümüş Tasarım Yüzük',
        description: 'Özel tasarım kararmayan gümüş yüzük.',
        price: 850.00,
        image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=500&q=80',
        category: 'Aksesuar',
        stock: 150
    },
    {
        name: 'Altın Kaplama Kolye',
        description: 'Şık davetler için pırlanta detaylı altın kaplama kolye.',
        price: 1450.00,
        image_url: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00ea?auto=format&fit=crop&w=500&q=80',
        category: 'Aksesuar',
        stock: 250
    },
    
    // --- TEKNOLOJİ ---
    {
        name: 'SSD Taşınabilir Disk (1 TB)',
        description: 'USB 3.0 yüksek hızlı veri transferi ve kompakt tasarım.',
        price: 1250.00,
        image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 150
    },
    {
        name: 'SanDisk 256GB SSD',
        description: 'Bilgisayarınızı uçuracak yeni nesil dahili SSD.',
        price: 800.00,
        image_url: 'https://images.unsplash.com/photo-1563208200-e79f6eb3cc9d?auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 80
    },
    {
        name: 'WD Harici Hard Disk',
        description: 'Tüm oyun ve yedekleriniz için devasa depolama alanı.',
        price: 2850.00,
        image_url: 'https://images.unsplash.com/photo-1563208200-e79f6eb3cc9d?auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 250
    },
    {
        name: 'Samsung 49 inç Kavisli Monitör',
        description: 'Oyuncular için tasarlanmış devasa QLED kavisli ekran.',
        price: 27500.00,
        image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 45
    },
    {
        name: 'Acer 21.5 inç Full HD Ekran',
        description: 'Ofis ve genel kullanım için çerçevesiz monitör.',
        price: 2950.00,
        image_url: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=500&q=80',
        category: 'Teknoloji',
        stock: 300
    },

    // --- KADIN GİYİM ---
    {
        name: 'Kadın Kışlık Kaban',
        description: 'Zarif kesimiyle hem şık hem de sıcak tutan kaban.',
        price: 1200.00,
        image_url: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 1000
    },
    {
        name: 'Kadın Deri Ceket',
        description: 'Motorcu tarzı kısa deri ceket.',
        price: 980.00,
        image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 450
    },
    {
        name: 'Kadın Basic Tişört',
        description: 'Günlük kombinleriniz için vazgeçilmez V yaka tişört.',
        price: 185.00,
        image_url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=500&q=80',
        category: 'Giyim',
        stock: 2000
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        await Product.deleteMany({});
        await Product.insertMany(products);
        
        console.log("Örnek ürünler MongoDB'ye başarıyla eklendi! Toplam: " + products.length);
        process.exit();
    } catch (error) {
        console.error("Veri eklenirken hata oluştu:", error.message);
        process.exit(1);
    }
};

seedDB();

const mongoose = require('mongoose');
require('dotenv').config();
const { Product } = require('./models');

// Her ürüne kendi özel görseli atanmış
const products = [
    // =================== TEKNOLOJİ ===================
    { name: 'Akıllı Telefon Pro Max', description: 'En son çıkan amiral gemisi akıllı telefon. Üstün kamera ve güçlü işlemci.', price: 32999, image_url: 'images/smartphone.png', category: 'Teknoloji', stock: 80 },
    { name: 'Mekanik Klavye RGB', description: 'Red switch, RGB aydınlatmalı, alüminyum kasalı mekanik klavye.', price: 1499, image_url: 'images/klavye.png', category: 'Teknoloji', stock: 120 },
    { name: 'Gürültü Engelleyici Kulaklık', description: 'Aktif gürültü engelleme, 30 saat pil ömrü, premium ses kalitesi.', price: 4299, image_url: 'images/kulaklik.png', category: 'Teknoloji', stock: 65 },
    { name: 'Oyuncu Monitörü 27 inç', description: '144Hz yenileme hızı, 1ms tepki süresi, HDR destekli.', price: 8499, image_url: 'images/monitor.png', category: 'Teknoloji', stock: 40 },
    { name: 'Kablosuz Oyuncu Mouse', description: '25600 DPI sensör, 70 saat pil, ergonomik tasarım.', price: 1299, image_url: 'images/mouse.png', category: 'Teknoloji', stock: 200 },
    { name: 'Akıllı Saat Series 8', description: 'Kalp ritmi, oksijen ölçümü, GPS, 18 saat pil ömrü.', price: 6999, image_url: 'images/saat.png', category: 'Teknoloji', stock: 90 },
    { name: 'Laptop Ultrabook 15 inç', description: 'Intel i7, 16GB RAM, 512GB SSD, Full HD ekran.', price: 28999, image_url: 'images/laptop.png', category: 'Teknoloji', stock: 35 },
    { name: 'Kablosuz Şarj Standı', description: '15W hızlı kablosuz şarj, üç cihazı aynı anda şarj eder.', price: 649, image_url: 'images/sarj.png', category: 'Teknoloji', stock: 300 },
    { name: 'Taşınabilir SSD 1TB', description: 'USB-C, 1050 MB/s okuma hızı, metal kasalı.', price: 2299, image_url: 'images/ssd.png', category: 'Teknoloji', stock: 150 },
    { name: 'Bluetooth Hoparlör', description: 'IP67 su geçirmez, 24 saat pil, 360° surround ses.', price: 1899, image_url: 'images/hoparlor.png', category: 'Teknoloji', stock: 110 },

    // =================== GİYİM ===================
    { name: 'Erkek Pamuklu Tişört', description: '%100 organik pamuk, slim fit kesim, 10 renk seçeneği.', price: 299, image_url: 'images/tisort.png', category: 'Giyim', stock: 500 },
    { name: 'Kadın Kışlık Kaban', description: 'Çift taraflı yün kaban, uzun kesim, şık tasarım.', price: 2499, image_url: 'images/kaban.png', category: 'Giyim', stock: 180 },
    { name: 'Erkek Slim Fit Gömlek', description: 'Ütü gerektirmeyen anti-wrinkle kumaş, klasik yaka.', price: 599, image_url: 'images/tisort.png', category: 'Giyim', stock: 250 },
    { name: 'Kadın Yazlık Elbise', description: 'Çiçekli desen, hafif şifon kumaş, midi boy.', price: 849, image_url: 'images/kaban.png', category: 'Giyim', stock: 200 },
    { name: 'Kapüşonlu Sweatshirt', description: 'Şardonlu iç yüzey, kanguru cepli, oversize fit.', price: 749, image_url: 'images/tisort.png', category: 'Giyim', stock: 320 },
    { name: 'Erkek Kot Pantolon', description: 'Elastan katkılı denim, slim fit, 5 cep.', price: 1099, image_url: 'images/kaban.png', category: 'Giyim', stock: 280 },
    { name: 'Erkek Deri Mont', description: 'Hakiki deri, moto-biker kesim, iç astarlı.', price: 3999, image_url: 'images/kaban.png', category: 'Giyim', stock: 90 },
    { name: 'Kadın Spor Taytı', description: 'Yüksek bel, nefes alabilen kumaş, dört yönlü esneme.', price: 549, image_url: 'images/tisort.png', category: 'Giyim', stock: 400 },
    { name: 'Örgü Boğazlı Kazak', description: 'Merino yün karışımı, boğazlı yaka, kış koleksiyonu.', price: 1299, image_url: 'images/kaban.png', category: 'Giyim', stock: 160 },
    { name: 'Kadın Sneaker Ayakkabı', description: 'Memory foam taban, nefes alabilen mesh üst, platform taban.', price: 1599, image_url: 'images/tisort.png', category: 'Giyim', stock: 230 },

    // =================== GIDA ===================
    { name: 'Organik Zeytinyağı 1L', description: 'Soğuk sıkım, naturel sızma, Ege bölgesi zeytinlerinden.', price: 399, image_url: 'images/gida.png', category: 'Gıda', stock: 500 },
    { name: 'Filtre Kahve 250g', description: 'Etiyopya kökenli, single origin, orta kavrulmuş.', price: 279, image_url: 'images/gida.png', category: 'Gıda', stock: 400 },
    { name: 'Süzme Çiçek Balı 500g', description: 'Doğal, katkısız, çiçek balı, yöresel üretim.', price: 349, image_url: 'images/gida.png', category: 'Gıda', stock: 300 },
    { name: 'Bitter Çikolata %70', description: 'Belçika kakaosu, %70 bitter, yüksek antioksidan.', price: 89, image_url: 'images/gida.png', category: 'Gıda', stock: 800 },
    { name: 'Karışık Kuruyemiş 500g', description: 'Badem, fındık, ceviz, kaju karışımı, tuzsuz.', price: 319, image_url: 'images/gida.png', category: 'Gıda', stock: 450 },
    { name: 'Yeşil Çay Seti', description: 'Japonya ve Çin kökenli 5 farklı yeşil çay çeşidi.', price: 199, image_url: 'images/gida.png', category: 'Gıda', stock: 350 },
    { name: 'Organik Kurutulmuş İncir', description: 'Aydın inciri, doğal kurutulmuş, şeker ilavesiz.', price: 159, image_url: 'images/gida.png', category: 'Gıda', stock: 600 },
    { name: 'Glutensiz Yulaf Ezmesi', description: 'Sertifikalı glutensiz, tam tahıllı, protein zengini.', price: 129, image_url: 'images/gida.png', category: 'Gıda', stock: 700 },
    { name: 'Dağ Kekiği 100g', description: 'Toroslardan toplanan, doğal kurutulmuş dağ kekiği.', price: 79, image_url: 'images/gida.png', category: 'Gıda', stock: 1000 },
    { name: 'Siyah Zeytin Ezmesi', description: 'Siyah zeytin ezmesi, baharat karışımı, 300g cam kavanoz.', price: 189, image_url: 'images/gida.png', category: 'Gıda', stock: 400 },

    // =================== OYUNCAK ===================
    { name: 'Pelüş Oyuncak Ayı 40cm', description: 'Ultra yumuşak pelüş kumaş, hipoalerjenik dolgu.', price: 299, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 300 },
    { name: 'Uzaktan Kumandalı Araba', description: '1:16 ölçek, 4WD, 2.4GHz, 35 km/h hız, şarj edilebilir.', price: 899, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 150 },
    { name: 'Eğitici Ahşap Bloklar', description: 'Doğal ahşap, zehirsiz boya, 3+ yaş, renk-şekil öğrenimi.', price: 449, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 200 },
    { name: 'Büyük Yapboz 1000 Parça', description: 'Doğa temalı, parlak baskı kalitesi, kutu hediyeye hazır.', price: 249, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 350 },
    { name: 'Rubik Küpü 3x3', description: 'Pürüzsüz dönen mekanizma, hız küpü, renk sticker.', price: 149, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 500 },
    { name: 'Oyun Hamuru Renkli Set', description: '12 canlı renk, toksik olmayan formül, kalıplar dahil.', price: 199, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 400 },
    { name: 'LEGO Yaratıcı Kutu 900 Parça', description: '900 parça, 10 farklı yapı tasarımı, 4-99 yaş.', price: 1299, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 120 },
    { name: 'Müzikli Bebek Oyuncağı', description: 'Işıklı müzikli interaktif oyuncak, 12+ ay.', price: 549, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 180 },
    { name: 'Su Tabancası Büyük Boy', description: '1.5L rezervuar, 8 metre menzil, omuz askılı.', price: 179, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 250 },
    { name: 'İnteraktif Robot Köpek', description: 'Dokunmaya tepki veren, ses çıkaran, 12 programlı hareket.', price: 1499, image_url: 'images/oyuncak.png', category: 'Oyuncak', stock: 80 },

    // =================== SPOR ===================
    { name: 'Yoga Matı 6mm', description: 'Kaymaz yüzey, çevre dostu TPE malzeme, taşıma kayışı dahil.', price: 599, image_url: 'images/spor.png', category: 'Spor', stock: 250 },
    { name: 'Dambıl Seti 2x10kg', description: 'Neopren kaplı, kaymaz tutam, renk kodlu ağırlıklar.', price: 899, image_url: 'images/spor.png', category: 'Spor', stock: 200 },
    { name: 'Atlama İpi Profesyonel', description: 'Çelik kablo, rulman sistemi, ayarlanabilir uzunluk.', price: 349, image_url: 'images/spor.png', category: 'Spor', stock: 400 },
    { name: 'Direnç Bandı Seti 5li', description: '5 farklı direnç seviyesi, kapı aparatı dahil.', price: 449, image_url: 'images/spor.png', category: 'Spor', stock: 350 },
    { name: 'Pilates Topu 65cm', description: 'Anti-burst teknoloji, slip-resistant yüzey, pompa dahil.', price: 299, image_url: 'images/spor.png', category: 'Spor', stock: 300 },
    { name: 'Sporcu Su Matarası 1L', description: 'BPA free tritan, sızdırmaz kapak, toz korumalı ağız.', price: 199, image_url: 'images/spor.png', category: 'Spor', stock: 600 },
    { name: 'Boks Eldiveni 12 oz', description: 'PU deri, şok emici dolgu, velcro bilek desteği.', price: 899, image_url: 'images/spor.png', category: 'Spor', stock: 150 },
    { name: 'Koşu Ayakkabısı', description: 'Ağırlık: 220g, nefes alabilen mesh, responsive taban.', price: 2299, image_url: 'images/spor.png', category: 'Spor', stock: 180 },
    { name: 'Spor Çantası 40L', description: 'Ayakkabı bölmeli, su geçirmez, yansıtıcı şeritli.', price: 749, image_url: 'images/spor.png', category: 'Spor', stock: 220 },
    { name: 'Bisiklet Kaskı Aero', description: 'CE sertifikalı, 22 havalandırma kanalı, ayarlanabilir.', price: 1299, image_url: 'images/spor.png', category: 'Spor', stock: 100 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`Toplam ${products.length} ürün başarıyla eklendi!`);
        process.exit();
    } catch (error) {
        console.error("Hata:", error);
        process.exit(1);
    }
};

seedDB();

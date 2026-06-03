# Bulut Bilişim Dersi Final Projesi: E-Ticaret Uygulaması

## 1. Proje Özeti ve Amacı
Bu projenin amacı, bulut bilişim konseptlerinin (özellikle **Otomatik Ölçeklendirme - Auto Scaling**, **Yük Dengeleme** ve **Yönetilen Bulut Veritabanları**) pratik bir senaryo üzerinden uygulanmasıdır. Senaryo olarak bir e-ticaret platformu seçilmiş olup, sistemin yüksek trafik altında kendi kendine yatay olarak ölçeklenebilmesi (scale out) hedeflenmiştir. 

Gereksiz karmaşıklıktan kaçınmak adına, uygulama modern bir **REST API (Backend)**, bulut tabanlı bir NoSQL veritabanı ve **Vanilla HTML/CSS/JS (Frontend)** bileşenlerinden oluşturulmuştur.

---

## 2. Kullanılan Teknolojiler
*   **Backend:** Node.js (Express.js) - *Hızlı, asenkron ve yatayda ölçeklenmeye çok uygun bir yapı.*
*   **Frontend:** HTML5, CSS3, JavaScript (Dark Mode ve Modern Tasarım)
*   **Veritabanı:** MongoDB (MongoDB Atlas) - *%100 Bulut tabanlı, sunucusuz (serverless) çalışan, yönetilen bir (Managed) NoSQL veritabanı.*
*   **Bulut Platformu:** AWS (Amazon Web Services)
    *   **İşlem (Compute):** EC2 (Elastic Compute Cloud)
    *   **Ölçeklendirme:** Auto Scaling Group
    *   **Yük Dağıtımı:** Application Load Balancer (ELB)

---

## 3. Proje Mimarisi

### 3.1. Uygulama Katmanı (Backend & Frontend)
Proje klasör yapısı `backend` ve `frontend` olmak üzere ikiye ayrılmıştır.
*   **Backend:** Node.js ve Mongoose ile çalışır. JSON Web Token (JWT) ile güvenli kimlik doğrulaması sağlar. `bcrypt` modülü ile şifreler korunur. AWS Load Balancer'ın sunucu sağlığını kontrol edebilmesi için bir `/health` uç noktası (endpoint) barındırır.
*   **Frontend:** API ile asenkron iletişim kuran tek sayfalı (SPA) modern bir arayüzdür.

### 3.2. Bulut ve Ölçeklendirme Mimarisi (AWS + Atlas)
Sistem tamamen bulut üzerinde şu şekilde kurgulanmıştır:
1.  **Bulut Veritabanı (MongoDB Atlas):** Uygulamanın veritabanı katmanı tamamen (örneğin AWS altyapısında barınan) MongoDB Atlas üzerinde yönetilir. EC2 sunucuları bulut üzerinden bu veritabanına güvenli şekilde erişir.
2.  **Amazon Machine Image (AMI):** Node.js uygulamasının çalıştığı, `pm2` ile arka planda daemon olarak ayarlandığı bir EC2 sunucusunun şablon imajı (AMI) alınmıştır.
3.  **Auto Scaling Group (ASG):** Alınan AMI şablon (Launch Template) olarak kullanılarak, sunucuların CPU kullanımı **%70'i** aştığında otomatik olarak yeni EC2 instance'ları başlatacak (Target Tracking Scaling Policy) şekilde bir grup oluşturulmuştur.
4.  **Application Load Balancer (ALB):** Kullanıcılardan (Frontend'den) gelen tüm istekler doğrudan ALB'ye (Yük Dengeleyici) ulaşır. ALB bu trafiği Target Group'taki sağlıklı Node.js sunucularına dağıtır.

---

## 4. Geliştirme Sürecindeki Adımlar
1.  **Planlama:** Node.js, MongoDB ve AWS mimarisi seçildi.
2.  **Bulut Veritabanı Kurulumu:** MongoDB Atlas üzerinde Cluster oluşturuldu ve Network Access ayarları yapılandırıldı.
3.  **Backend Geliştirme:** Express.js ve Mongoose ile API uç noktaları kodlandı.
4.  **Frontend Geliştirme:** API ile entegre çalışan şık bir önyüz oluşturuldu.
5.  **AWS Dağıtımı:** Backend uygulaması AWS EC2 üzerine yüklendi. Load Balancer ve Auto Scaling Group ayarları AWS Konsolu üzerinden yapıldı.
6.  **Yük Testi ve Doğrulama:** Sisteme yük bindirilerek ASG'nin yeni sunucuları otomatik açması ve ALB'nin trafiği dağıtması gözlemlendi.

---

## 5. Sonuç ve Kazanımlar
Bu proje sayesinde, tek bir fiziksel veya sanal makineye bağlı kalmadan; veritabanının (Atlas) ve uygulama katmanının (EC2 ASG) tamamen bulut konseptlerine (Esneklik, Yüksek Erişilebilirlik, Ölçeklenebilirlik) uygun olarak nasıl tasarlanacağı pratik edilmiştir.

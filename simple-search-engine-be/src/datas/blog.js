/**
 * =====================================================
 * FILE: blog.js
 * =====================================================
 * File ini berisi DATA BLOG yang berfungsi sebagai CORPUS (kumpulan dokumen)
 * untuk pencarian menggunakan algoritma TF-IDF.
 * 
 * Setiap blog memiliki properti:
 * - id: Identifikasi unik untuk setiap blog
 * - author: Penulis blog
 * - title: Judul blog
 * - content: Isi/konten blog (yang akan dianalisis oleh TF-IDF)
 * - date: Tanggal publikasi blog
 * 
 * Data ini digunakan sebagai sumber data pencarian di blogController.js
 * =====================================================
 */

// Array berisi objek-objek blog yang akan dicari menggunakan TF-IDF
export const blogs = [
    {
        // Blog 1: Pengenalan JavaScript
        "id": 1,
        "author": "Ahmad Wijaya",
        "title": "Pengenalan JavaScript untuk Pemula",
        "content": "JavaScript adalah bahasa pemrograman serbaguna yang digunakan untuk pengembangan web. Awalnya dibuat untuk menambahkan interaktivitas pada halaman web, JavaScript telah berkembang menjadi salah satu bahasa pemrograman paling banyak digunakan di dunia. JavaScript dapat dijalankan di browser maupun di server menggunakan Node.js. Framework seperti React, Angular, dan Vue.js telah membuat JavaScript semakin powerful untuk membuat antarmuka pengguna yang modern dan responsif. JavaScript juga mendukung pengembangan full-stack, menjadikannya pilihan utama bagi developer web.",
        "date": "2024-09-25"
    },
    {
        // Blog 2: Memahami CSS Flexbox
        "id": 2,
        "author": "Siti Rahayu",
        "title": "Memahami CSS Flexbox untuk Layout Modern",
        "content": "CSS Flexbox adalah modul layout modern yang memudahkan desainer dalam membuat layout yang fleksibel dan responsif. Sebelum Flexbox, developer web banyak bergantung pada layout berbasis float yang sulit dikelola, terutama saat membangun struktur yang kompleks. Flexbox menyederhanakan ini dengan memungkinkan item dalam container untuk disejajarkan dan didistribusikan secara dinamis. Properti seperti justify-content, align-items, dan flex-direction memberikan kontrol penuh atas spacing, alignment, dan urutan item. Flexbox sangat ideal untuk membuat layout dinamis yang menyesuaikan ukuran layar.",
        "date": "2024-09-26"
    },
    {
        // Blog 3: Python untuk Data Science
        "id": 3,
        "author": "Budi Santoso",
        "title": "Python untuk Data Science dan Analisis Data",
        "content": "Python telah menjadi bahasa utama dalam industri data science karena kesederhanaannya, kemudahan dibaca, dan library yang lengkap. Library seperti NumPy, Pandas, dan Scikit-learn membuat Python menjadi alat yang sangat powerful untuk manipulasi data, membangun model machine learning, dan melakukan analisis data. Kemudahan penggunaan Python memungkinkan pemula maupun profesional untuk menulis kode yang bersih dan efisien. Integrasi Python dengan Jupyter Notebook juga menjadikannya favorit bagi data scientist yang ingin memvisualisasikan dan membagikan hasil analisis secara interaktif.",
        "date": "2024-09-27"
    },
    {
        // Blog 4: Panduan RESTful API
        "id": 4,
        "author": "Dewi Lestari",
        "title": "Panduan Lengkap RESTful API untuk Developer",
        "content": "RESTful API adalah konsep fundamental dalam pengembangan web modern yang memungkinkan sistem berkomunikasi melalui internet menggunakan HTTP request. REST menyediakan serangkaian constraint arsitektur untuk membangun API yang efisien dan scalable. REST API bersifat stateless, artinya setiap request berisi semua informasi yang diperlukan untuk memenuhi permintaan. Ini membuat REST ideal untuk sistem terdistribusi. Banyak layanan web populer seperti Twitter dan GitHub mengekspos data mereka melalui REST API, menjadikannya standar industri untuk membangun integrasi dan aplikasi.",
        "date": "2024-09-28"
    },
    {
        // Blog 5: Machine Learning
        "id": 5,
        "author": "Rizky Pratama",
        "title": "Pengenalan Machine Learning dan Kecerdasan Buatan",
        "content": "Machine learning adalah cabang dari kecerdasan buatan yang berfokus pada membangun algoritma yang dapat belajar dari data dan membuat keputusan. Alih-alih diprogram secara eksplisit untuk melakukan tugas, model machine learning dilatih pada dataset dan dapat meningkatkan performanya seiring waktu. Machine learning digunakan di berbagai industri, dari keuangan hingga kesehatan, dan menjadi teknologi di balik recommendation engine, pengenalan wajah, dan kendaraan otonom. Tools seperti TensorFlow dan PyTorch memudahkan developer untuk membangun dan deploy model machine learning.",
        "date": "2024-09-29"
    },
    {
        // Blog 6: MERN Stack
        "id": 6,
        "author": "Andi Firmansyah",
        "title": "Membangun Aplikasi Web dengan MERN Stack",
        "content": "MERN Stack terdiri dari MongoDB, Express, React, dan Node.js merupakan solusi full-stack JavaScript populer untuk membangun aplikasi web. MongoDB berperan sebagai database NoSQL, Express menangani logika server-side, React menyediakan antarmuka pengguna front-end, dan Node.js memungkinkan JavaScript berjalan di server. Stack ini sangat disukai karena menggunakan JavaScript end-to-end, memungkinkan developer menggunakan satu bahasa untuk pengembangan client-side dan server-side. Fleksibilitas dan kemudahan penggunaan membuat MERN Stack ideal untuk membangun aplikasi web modern dan scalable.",
        "date": "2024-09-30"
    },
    {
        // Blog 7: Docker dan Containerization
        "id": 7,
        "author": "Muhammad Fajar",
        "title": "Memulai Docker dan Containerization",
        "content": "Docker telah merevolusi cara developer membangun, mengirim, dan menjalankan aplikasi dengan memperkenalkan containerization. Container memungkinkan developer mengemas aplikasi beserta dependencies-nya ke dalam satu unit terisolasi yang dapat berjalan konsisten di lingkungan manapun. Ini menghilangkan masalah klasik 'works on my machine', karena container menyediakan runtime yang konsisten terlepas dari sistem yang mendasarinya. Docker telah menjadi alat kritikal dalam DevOps, memungkinkan tim untuk build, test, dan deploy aplikasi lebih cepat dengan lebih sedikit error.",
        "date": "2024-10-01"
    },
    {
        // Blog 8: Cloud Computing
        "id": 8,
        "author": "Lisa Handayani",
        "title": "Pengenalan Cloud Computing dan Layanan Cloud",
        "content": "Cloud computing mengacu pada penyediaan layanan komputasi melalui internet, memungkinkan organisasi mengakses storage, processing power, database, dan lainnya tanpa harus memelihara hardware fisik. Platform cloud seperti AWS, Google Cloud, dan Microsoft Azure menyediakan solusi scalable untuk hosting aplikasi, menyimpan data, dan menganalisis dataset besar. Cloud computing menawarkan fleksibilitas, skalabilitas, dan penghematan biaya, menjadikannya bagian esensial dari infrastruktur IT modern. Developer dapat dengan cepat membuat virtual machine atau deploy aplikasi web tanpa khawatir tentang hardware.",
        "date": "2024-10-02"
    },
    {
        // Blog 9: DevOps dan CI/CD
        "id": 9,
        "author": "Hendra Kusuma",
        "title": "DevOps dan Continuous Integration Deployment",
        "content": "DevOps adalah serangkaian praktik yang mengintegrasikan pengembangan software dan operasi IT untuk memperpendek siklus pengembangan dan menghasilkan software berkualitas tinggi secara berkelanjutan. Kebangkitan DevOps telah mentransformasi cara tim berkolaborasi, mengotomasi workflow, dan deploy kode ke production. Pipeline CI/CD, containerization dengan Docker, dan Infrastructure as Code adalah beberapa tools dan praktik inti dalam toolkit DevOps. Dengan mengadopsi DevOps, organisasi dapat meningkatkan agility, kolaborasi, dan mengurangi waktu untuk deliver fitur baru dan update.",
        "date": "2024-10-03"
    },
    {
        // Blog 10: Metodologi Agile
        "id": 10,
        "author": "Indah Permata",
        "title": "Pengenalan Metodologi Agile dan Scrum",
        "content": "Metodologi Agile adalah pendekatan manajemen proyek yang mengutamakan fleksibilitas, kolaborasi, dan feedback pelanggan. Berbeda dengan metode waterfall tradisional yang mengikuti path linear, Agile membagi proyek menjadi siklus iteratif yang lebih kecil yang disebut sprint. Selama setiap sprint, tim mengerjakan tugas spesifik dan me-review hasilnya dengan stakeholder, memungkinkan penyesuaian cepat berdasarkan feedback. Penekanan Agile pada kemajuan inkremental, komunikasi terbuka, dan adaptabilitas menjadikannya ideal untuk proyek kompleks dengan kebutuhan yang terus berkembang. Scrum dan Kanban adalah dua framework populer dalam metodologi Agile.",
        "date": "2024-10-04"
    }
]


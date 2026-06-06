# MomCare Connect 🤱

**MomCare Connect** adalah platform web Minimum Viable Product (MVP) sistem pakar yang dirancang khusus untuk membantu **Kader Kesehatan Desa / Posyandu** dalam mendeteksi dini risiko preeklampsia pada ibu hamil secara cepat, akurat, dan terstruktur. Platform ini juga mempermudah pengiriman laporan rujukan langsung ke Bidan Desa melalui WhatsApp.

---

## ✨ Fitur Utama

- **🔐 Portal Autentikasi Kader**: Fitur Registrasi dan Login aman bagi kader kesehatan desa menggunakan enkripsi sandi (`bcryptjs`) dan token JWT yang disimpan aman dalam cookie **HTTP-Only (Secure, SameSite: Strict)**.
- **🛡️ Isolasi Data Sesi (Privasi)**: Data riwayat skrining terisolasi aman per akun kader. Kader hanya dapat melihat dan mencari rekam medis ibu hamil yang mereka periksa sendiri.
- **🧠 Logika Sistem Pakar (Rule-Based)**: Klasifikasi otomatis status **"Risiko Tinggi"** vs **"Aman"** secara real-time berdasarkan 4 kriteria klinis utama:
  - **Tekanan Darah**: Sistolik $\ge 160$ mmHg atau Diastolik $\ge 90$ mmHg.
  - **Usia Ibu**: $\ge 35$ tahun.
  - **IMT sebelum hamil**: Obesitas ($>30$).
  - **Gravida**: Kehamilan pertama (Nulipara) atau jarak kehamilan sebelumnya $>10$ tahun.
- **📊 Dasbor Statistik Analitik (SVG)**: Visualisasi data real-time berbasis SVG interaktif (ringan tanpa *library* luar) yang menyajikan:
  - **Donut Chart**: Proporsi pasien berstatus aman vs berisiko tinggi.
  - **Faktor Risiko Terbanyak**: Grafik bar progresif faktor pemicu dominan di lapangan.
  - **Distribusi Usia Ibu**: Grafik sebaran kelompok usia pasien (Remaja, Ideal, Berisiko).
- **🧮 Kalkulator IMT Pembantu**: Kalkulator mini terintegrasi untuk menghitung Indeks Massa Tubuh (IMT) ibu hamil secara otomatis dari input Berat Badan (kg) dan Tinggi Badan (cm).
- **📲 Integrasi Notifikasi WhatsApp**: Tombol instan untuk membagikan laporan hasil skrining ke Bidan Desa dengan format pesan WhatsApp yang ringkas, rapi, dan informatif.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) dengan compiler [React 19](https://react.dev/) & [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack).
- **Database ORM**: [Prisma 7](https://www.prisma.io/) dengan PostgreSQL (Supabase Pooler).
- **Driver Adapter**: `@prisma/adapter-pg` & `pg` (untuk koneksi serverless handal bebas error `P6001`).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) untuk UI yang premium, modern, dan sangat responsif.
- **Keamanan**: `jsonwebtoken` (JWT) & `bcryptjs` untuk otentikasi sesi kader.

---

## 🚀 Cara Menjalankan Proyek di Lokal

### Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 18 ke atas direkomendasikan)
- NPM atau Yarn

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/C4R4MeL/UAS-PRAKPBW-KLP14.git
cd momcare-connect
```

### Langkah 2: Instal Dependensi
```bash
npm install
```

### Langkah 3: Konfigurasi File Lingkungan (`.env`)
Buat file bernama `.env` di root direktori proyek, lalu isi konfigurasi database Supabase Anda dan JWT Secret:
```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
JWT_SECRET="momcare-connect-super-secret-key-2026"
```
*(Gunakan URL pooler IPv4 Supabase di atas port 5432 untuk mencegah timeout).*

### Langkah 4: Sinkronisasi Skema Database (Prisma)
Jalankan perintah berikut untuk menghasilkan Prisma Client dan melakukan sinkronisasi tabel model (`Kader` dan `Skrining`) ke database Supabase Anda:
```bash
npx prisma generate
npx prisma db push
```

### Langkah 5: Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser Anda dan akses halaman di [http://localhost:3000](http://localhost:3000).

---

## 📂 Struktur Folder Utama

```text
momcare-connect/
├── prisma/
│   └── schema.prisma         # Skema database relasional (Kader & Skrining)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts # API Registrasi Kader
│   │   │   │   ├── login/route.ts    # API Login Kader (Cookie HTTP-Only)
│   │   │   │   └── me/route.ts       # API Profil & Logout
│   │   │   └── skrining/route.ts     # API Skrining Berelasi (GET & POST)
│   │   ├── globals.css       # Animasi mikro dan tema Tailwind
│   │   ├── layout.tsx        # Layout utama Next.js
│   │   └── page.tsx          # Halaman portal login dan dasbor utama UI/UX
│   └── lib/
│       └── prisma.ts         # Singleton Client dengan Adapter PG untuk Prisma 7
├── .env                      # File kredensial lokal (diabaikan oleh git)
├── next.config.ts            # Konfigurasi Next.js
└── package.json              # Dependensi proyek
```

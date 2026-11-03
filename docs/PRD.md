# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Smart Waste Management System

**Version:** 1.2.0  
**Status:** Draft  
**Project Type:** Web Application & Machine Learning  
**Date:** 3 November 2026

---

## 1. Project Overview

### 1.1 Background

Pengelolaan sampah merupakan salah satu permasalahan lingkungan yang membutuhkan perhatian masyarakat. Proses pelaporan sampah yang masih dilakukan secara manual dapat menyulitkan masyarakat dalam menyampaikan informasi mengenai lokasi dan kondisi sampah.

Smart Waste Management System merupakan aplikasi berbasis web yang dirancang untuk mempermudah masyarakat dalam melaporkan permasalahan sampah serta membantu admin dalam mengelola dan memantau laporan.

Sistem ini dilengkapi dengan teknologi Artificial Intelligence (AI) untuk mengidentifikasi kategori sampah berdasarkan gambar yang diunggah pengguna.

Melalui sistem ini, masyarakat dapat membuat laporan secara online, sedangkan admin dapat melakukan verifikasi dan memperbarui status penanganan laporan melalui dashboard.

### 1.2 Project Objectives

Tujuan pengembangan sistem:

1. Mempermudah masyarakat dalam melaporkan permasalahan sampah.
2. Menyediakan platform terpusat untuk pengelolaan laporan sampah.
3. Mengimplementasikan AI Image Classification untuk mengidentifikasi kategori sampah.
4. Mempermudah admin dalam memantau dan mengelola laporan.
5. Memberikan transparansi informasi perkembangan laporan kepada pengguna.

### 1.3 Project Scope

Sistem terdiri dari dua komponen utama:

| Component           | Description                                     |
| ------------------- | ----------------------------------------------- |
| Website Application | Aplikasi web untuk Admin dan User               |
| Machine Learning    | Model AI untuk mengklasifikasikan gambar sampah |

---

## 2. User Roles

Sistem memiliki dua role utama.

### 2.1 Admin

Admin bertanggung jawab mengelola seluruh aktivitas pelaporan sampah.

Hak akses:

- Login ke dashboard admin.
- Melihat statistik seluruh laporan.
- Melihat seluruh laporan pengguna.
- Melihat detail laporan.
- Mengubah informasi laporan.
- Mengubah status laporan.
- Menghapus laporan.
- Mengelola data pengguna.
- Melakukan pencarian dan filter laporan.

### 2.2 User

User merupakan masyarakat yang menggunakan website untuk membuat laporan sampah.

Hak akses:

- Melakukan registrasi.
- Login dan logout.
- Melihat dashboard pengguna.
- Membuat laporan sampah.
- Mengunggah foto sampah.
- Mengambil lokasi menggunakan GPS browser.
- Menggunakan fitur AI Image Detection.
- Melihat riwayat laporan.
- Melihat detail dan status laporan.
- Mengelola profil.

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

#### User Authentication

- User dapat melakukan registrasi menggunakan nama, email, dan password.
- User dapat login menggunakan email dan password.
- User dapat logout.
- Sistem melakukan validasi kredensial.
- Password harus disimpan dalam bentuk hash.

#### Admin Authentication

- Admin dapat login menggunakan email dan password.
- Admin diarahkan ke dashboard admin setelah berhasil login.
- User biasa tidak dapat mengakses halaman admin.
- Admin dapat logout.

#### Authorization

Sistem menerapkan Role-Based Access Control (RBAC).

| Feature              | Admin | User    |
| -------------------- | ----- | ------- |
| Login                | Yes   | Yes     |
| Register             | No    | Yes     |
| Admin Dashboard      | Yes   | No      |
| User Dashboard       | No    | Yes     |
| View All Reports     | Yes   | No      |
| View Own Reports     | Yes   | Yes     |
| Create Report        | No    | Yes     |
| Update Report        | Yes   | Limited |
| Delete Report        | Yes   | Limited |
| Update Report Status | Yes   | No      |
| User Management      | Yes   | No      |
| Profile Management   | Yes   | Yes     |

User hanya dapat mengakses dan mengelola laporan miliknya sendiri sesuai aturan sistem.

### 3.2 Admin Dashboard

Dashboard admin menampilkan ringkasan statistik laporan.

Informasi yang ditampilkan:

- Total Reports.
- Pending Reports.
- In Progress Reports.
- Completed Reports.
- Rejected Reports.

Komponen tambahan:

- Grafik jumlah laporan berdasarkan periode.
- Distribusi kategori sampah.
- Daftar laporan terbaru.
- Ringkasan aktivitas laporan.

### 3.3 User Dashboard

Dashboard pengguna menampilkan:

- Total laporan yang dibuat.
- Jumlah laporan Pending.
- Jumlah laporan In Progress.
- Jumlah laporan Completed.
- Jumlah laporan Rejected.
- Daftar laporan terbaru.

Seluruh statistik hanya berdasarkan laporan milik pengguna yang sedang login.

### 3.4 Waste Report Management

#### Create Report

User dapat membuat laporan sampah dengan informasi berikut:

| Field          | Type    | Required |
| -------------- | ------- | -------- |
| Title          | String  | Yes      |
| Description    | Text    | Yes      |
| Image          | Image   | Yes      |
| Waste Category | String  | Yes      |
| Latitude       | Decimal | Yes      |
| Longitude      | Decimal | Yes      |
| Address        | String  | Optional |

Alur pembuatan laporan:

1. User membuka halaman Create Report.
2. User mengunggah foto sampah melalui kamera atau galeri.
3. Sistem mengirim gambar ke Machine Learning API.
4. AI melakukan klasifikasi gambar.
5. Sistem menampilkan hasil prediksi dan confidence score.
6. User mengonfirmasi kategori sampah.
7. User mengisi judul dan deskripsi laporan.
8. Sistem mengambil koordinat GPS menggunakan browser.
9. User mengirim laporan.
10. Backend melakukan validasi dan menyimpan data laporan.
11. Sistem menampilkan notifikasi bahwa laporan berhasil dibuat.

Jika GPS tidak tersedia atau izin lokasi ditolak, user dapat menentukan lokasi melalui input koordinat atau pemilihan titik pada peta.

#### Read Report

Admin dapat melihat seluruh laporan.

User hanya dapat melihat laporan miliknya sendiri.

Informasi laporan meliputi:

- Nama pelapor.
- Foto sampah.
- Judul laporan.
- Deskripsi.
- Kategori sampah.
- Lokasi.
- Tanggal laporan.
- Status laporan.

#### Update Report

Admin dapat memperbarui informasi laporan.

User dapat memperbarui laporan miliknya selama status masih Pending.

#### Delete Report

Admin dapat menghapus laporan.

User dapat menghapus laporan miliknya sendiri selama status masih Pending.

### 3.5 Report Filtering & Search

Admin dapat melakukan:

- Pencarian berdasarkan judul laporan.
- Pencarian berdasarkan nama pelapor.
- Filter berdasarkan kategori sampah.
- Filter berdasarkan status.
- Filter berdasarkan tanggal.
- Pagination laporan.

User dapat melakukan:

- Pencarian laporan miliknya.
- Filter berdasarkan kategori.
- Filter berdasarkan status.
- Pagination riwayat laporan.

### 3.6 Report Status Management

Status laporan terdiri dari empat kategori.

| Status      | Description                                    |
| ----------- | ---------------------------------------------- |
| Pending     | Laporan baru diterima dan menunggu pemeriksaan |
| In Progress | Laporan sedang ditangani                       |
| Completed   | Laporan telah selesai ditangani                |
| Rejected    | Laporan ditolak oleh admin                     |

Admin dapat memperbarui status laporan.

Setiap perubahan status harus disimpan ke dalam riwayat perubahan status.

### 3.7 User Management

Admin dapat:

- Melihat seluruh pengguna.
- Melihat detail pengguna.
- Menambahkan pengguna.
- Mengubah informasi pengguna.
- Menghapus pengguna.
- Mencari pengguna berdasarkan nama atau email.
- Melihat jumlah laporan setiap pengguna.

### 3.8 Profile Management

Admin dan User dapat:

- Melihat informasi profil.
- Mengubah nama.
- Mengubah informasi profil yang diizinkan.
- Mengubah password.

---

## 4. Machine Learning Requirements

### 4.1 Objective

Membangun model Machine Learning yang mampu mengklasifikasikan gambar sampah ke dalam tiga kategori.

### 4.2 Classification Categories

| Category      | Examples                                |
| ------------- | --------------------------------------- |
| Organic Waste | Daun, kulit buah, sisa makanan          |
| Plastic Waste | Botol plastik, kantong plastik, kemasan |
| Paper Waste   | Kardus, koran, kertas bekas             |

### 4.3 Dataset Requirements

Dataset minimal terdiri dari 150 gambar.

Pembagian awal:

| Category      | Images |
| ------------- | -----: |
| Organic Waste |     50 |
| Plastic Waste |     50 |
| Paper Waste   |     50 |
| Total         |    150 |

Dataset dibagi menjadi:

- Training: 70%.
- Validation: 15%.
- Testing: 15%.

Dataset harus memiliki variasi gambar dari berbagai sudut, pencahayaan, latar belakang, dan kondisi objek.

Pembagian dataset dilakukan secara stratified agar distribusi kategori tetap seimbang. Augmentasi gambar hanya diterapkan pada data training untuk menghindari data leakage.

### 4.4 Model Development

Teknologi:

- Python.
- TensorFlow/Keras.
- NumPy.
- Pandas.
- Matplotlib.
- Scikit-learn.

Metode yang direkomendasikan:

**Transfer Learning menggunakan MobileNetV2.**

Tahapan:

1. Mengumpulkan dataset.
2. Membersihkan dataset.
3. Melakukan preprocessing gambar.
4. Membagi dataset.
5. Membangun model klasifikasi.
6. Melakukan training.
7. Melakukan validation.
8. Melakukan testing.
9. Mengevaluasi performa model.
10. Menyimpan model hasil training.

### 4.5 Model Evaluation

Model harus menghasilkan:

- Accuracy.
- Confusion Matrix.
- Classification Report.
- Precision.
- Recall.
- F1-Score.

**Target minimum accuracy: 80% pada testing dataset.**

Hasil evaluasi harus berasal dari data testing yang tidak digunakan selama training dan tuning model.

### 4.6 Machine Learning API

Menggunakan FastAPI untuk menyediakan layanan prediksi gambar.

| Method | Endpoint   | Description                  |
| ------ | ---------- | ---------------------------- |
| GET    | `/health`  | Memeriksa status API         |
| POST   | `/predict` | Melakukan klasifikasi gambar |

Contoh respons prediksi:

```json
{
  "success": true,
  "prediction": {
    "category": "Plastic Waste",
    "confidence": 0.94
  }
}
```

Nilai confidence merupakan contoh format respons, bukan hasil prediksi aktual.

API harus memiliki:

- Validasi format gambar.
- Validasi ukuran file.
- Penanganan error.
- Response JSON yang konsisten.
- Dokumentasi API menggunakan Swagger/OpenAPI.

---

## 5. System Architecture

Sistem menggunakan arsitektur terpisah antara frontend, backend, database, dan Machine Learning Service.

### 5.1 Architecture Components

| Component      | Technology               | Responsibility                    |
| -------------- | ------------------------ | --------------------------------- |
| Frontend       | React                    | Antarmuka Admin dan User          |
| UI             | Tailwind CSS + shadcn/ui | Komponen antarmuka                |
| Backend        | Laravel                  | Business Logic dan Authentication |
| Database       | MySQL                    | Penyimpanan data                  |
| Authentication | Laravel Sanctum          | Autentikasi API                   |
| ML Service     | FastAPI                  | Prediksi gambar                   |
| ML Model       | TensorFlow/Keras         | Klasifikasi sampah                |
| Image Storage  | Cloudinary               | Penyimpanan foto                  |

### 5.2 Communication Flow

1. Admin dan User mengakses website React.
2. Website berkomunikasi dengan Laravel melalui REST API.
3. Laravel melakukan validasi dan memproses permintaan.
4. Laravel menyimpan data ke MySQL.
5. Website mengirim gambar ke FastAPI untuk prediksi AI.
6. FastAPI memproses gambar menggunakan model TensorFlow.
7. Hasil klasifikasi dikirim kembali ke website.
8. Foto laporan disimpan di Cloudinary.
9. Laravel menyimpan URL gambar dan hasil klasifikasi ke database.

---

## 6. Database Requirements

Database menggunakan MySQL.

Tabel utama:

| Table                   | Description              |
| ----------------------- | ------------------------ |
| users                   | Data admin dan pengguna  |
| waste_reports           | Data laporan sampah      |
| report_status_histories | Riwayat perubahan status |

Tabel tambahan:

| Table                  | Description                       |
| ---------------------- | --------------------------------- |
| personal_access_tokens | Token autentikasi Laravel Sanctum |

### Database Relationships

- Users memiliki banyak Waste Reports.
- Waste Reports dimiliki oleh satu User.
- Waste Reports memiliki banyak Report Status Histories.
- Report Status Histories mencatat perubahan status laporan oleh Admin.

---

## 7. Non-Functional Requirements

### 7.1 Security

- Password disimpan dalam bentuk hash.
- API menggunakan autentikasi.
- Hak akses dibedakan berdasarkan role.
- User tidak dapat mengakses laporan milik user lain.
- Validasi dilakukan di backend.
- Upload gambar memiliki validasi tipe dan ukuran file.
- Endpoint admin dilindungi middleware authorization.

### 7.2 Performance

- Dashboard menampilkan data secara efisien.
- Daftar laporan menggunakan pagination.
- Gambar dioptimasi sebelum disimpan.
- API memiliki waktu respons yang wajar.
- Proses AI memberikan hasil prediksi dalam waktu yang wajar.

### 7.3 Responsive Design

Website harus mendukung:

- Desktop.
- Tablet.
- Smartphone.

Antarmuka harus mudah digunakan pada berbagai ukuran layar.

### 7.4 Reliability

- Sistem menangani kegagalan API.
- Kegagalan prediksi AI tidak menyebabkan kehilangan data laporan.
- Sistem menampilkan pesan error yang informatif.
- Setiap perubahan status tercatat.
- Sistem melakukan validasi sebelum menyimpan data.

---

## 8. User Flow

### 8.1 Admin Flow

1. Admin membuka website.
2. Admin melakukan login.
3. Sistem memvalidasi kredensial dan role.
4. Admin masuk ke dashboard.
5. Admin membuka menu Reports.
6. Admin memilih laporan.
7. Admin melihat detail laporan.
8. Admin memperbarui status laporan.
9. Sistem menyimpan perubahan dan riwayat status.

### 8.2 User Flow

1. User membuka website.
2. User melakukan register atau login.
3. User masuk ke dashboard.
4. User memilih Create Report.
5. User mengunggah foto sampah.
6. AI melakukan klasifikasi.
7. Sistem menampilkan hasil prediksi.
8. User mengonfirmasi kategori.
9. User mengisi judul dan deskripsi.
10. User menentukan lokasi GPS.
11. User mengirim laporan.
12. User melihat laporan di halaman History.
13. User memantau perkembangan status laporan.

---

## 9. Project Milestones

| Phase | Task                 | Deliverable          |
| ----- | -------------------- | -------------------- |
| 1     | Requirement Analysis | PRD                  |
| 2     | System Design        | Architecture & ERD   |
| 3     | Backend Setup        | Laravel API          |
| 4     | Authentication       | Login & Register API |
| 5     | Report Management    | CRUD Reports API     |
| 6     | Admin Website        | Admin Dashboard      |
| 7     | User Website         | User Dashboard       |
| 8     | Dataset Preparation  | Dataset 3 Kategori   |
| 9     | ML Development       | Trained Model        |
| 10    | ML API               | FastAPI Service      |
| 11    | Integration          | Integrated System    |
| 12    | Testing              | Testing Report       |
| 13    | Deployment           | Deployed Application |

---

## 10. Acceptance Criteria

### Website

- Admin dapat login.
- User dapat register dan login.
- Dashboard admin menampilkan statistik laporan.
- Dashboard user menampilkan statistik laporan miliknya.
- Admin dapat melakukan CRUD laporan.
- User dapat membuat dan mengelola laporan miliknya sesuai ketentuan.
- Admin dapat mengelola pengguna.
- Admin dapat mengubah status laporan.
- Sistem menyediakan pencarian dan filter.
- Website responsive.
- User tidak dapat mengakses data laporan pengguna lain.

### Machine Learning

- Dataset minimal 150 gambar.
- Memiliki tiga kategori klasifikasi.
- Model berhasil dilatih dan diuji.
- Accuracy testing mencapai minimal 80%.
- Confusion Matrix tersedia.
- Classification Report tersedia.
- FastAPI dapat menerima gambar dan mengembalikan hasil prediksi.

### Integration

- Website terhubung dengan Laravel API.
- Laravel terhubung dengan MySQL.
- Website dapat menggunakan FastAPI untuk prediksi gambar.
- Foto laporan tersimpan di image storage.
- Hasil prediksi AI dapat digunakan dalam proses pembuatan laporan.

---

## 11. Out of Scope

Fitur berikut tidak termasuk dalam pengembangan versi pertama:

- Aplikasi Android dan iOS.
- Sistem pembayaran.
- Sistem reward dan poin pengguna.
- Live tracking petugas kebersihan.
- Push notification.
- Integrasi dengan layanan pengangkutan sampah.
- Klasifikasi sampah selain tiga kategori yang ditentukan.

---

## 12. Future Improvements

Pengembangan lanjutan yang memungkinkan:

- Peta persebaran laporan sampah.
- Penambahan kategori sampah.
- Statistik laporan berdasarkan wilayah.
- Sistem reward untuk pengguna aktif.
- Integrasi dengan petugas kebersihan.
- Notifikasi ketika status laporan berubah.
- AI Object Detection untuk mendeteksi beberapa jenis sampah dalam satu gambar.

---

**End of Document**

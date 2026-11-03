# API Documentation

## Smart Waste Management System

**Version:** 1.0.0\
**Status:** Draft\
**Backend:** Laravel REST API\
**Frontend:** React.js + TypeScript + Vite\
**Database:** MySQL\
**Authentication:** Laravel Sanctum\
**ML Service:** Python + FastAPI

------------------------------------------------------------------------

## 1. Overview

Dokumen ini menjelaskan kontrak komunikasi antara frontend React.js dan
backend Laravel REST API untuk Smart Waste Management System.

Laravel bertanggung jawab atas autentikasi, otorisasi, validasi,
business logic, penyimpanan data ke MySQL, pengelolaan gambar melalui
Cloudinary, serta komunikasi dengan Machine Learning Service.

React.js tidak berkomunikasi langsung dengan MySQL. Untuk integrasi AI,
frontend mengirim gambar ke Laravel dan Laravel meneruskan permintaan
prediksi ke FastAPI. Dengan pendekatan ini, alamat internal dan
konfigurasi FastAPI tidak perlu diekspos kepada browser.

### 1.1 Base URL

Development:

``` text
http://localhost:8000/api
```

Production (placeholder):

``` text
https://your-domain.com/api
```

Ganti domain production sesuai domain deployment.

### 1.2 API Conventions

-   Format request dan response utama menggunakan JSON.
-   Upload gambar menggunakan `multipart/form-data`.
-   Semua endpoint menggunakan prefix `/api`.
-   Endpoint privat memerlukan token Laravel Sanctum, kecuali jika
    konfigurasi Sanctum menggunakan cookie-based SPA authentication.
-   Waktu response menggunakan ISO 8601.
-   Nama field menggunakan `snake_case`.
-   Pagination menggunakan query parameter `page` dan `per_page`.
-   Laravel bertanggung jawab memvalidasi seluruh input dari client.

### 1.3 Common Headers

Request JSON:

``` http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>
```

Request upload file:

``` http
Accept: application/json
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Header `Authorization` tidak diperlukan pada endpoint publik seperti
register dan login.

------------------------------------------------------------------------

## 2. Authentication

Autentikasi API menggunakan Laravel Sanctum Personal Access Token.

Setelah login berhasil, backend mengembalikan token. Frontend
menggunakan token tersebut untuk mengakses endpoint privat.

> Catatan implementasi: jika frontend dan Laravel di-deploy pada domain
> yang sama atau subdomain yang dikonfigurasi untuk Sanctum SPA
> authentication, cookie-based authentication dengan CSRF dapat dipilih
> sebagai alternatif. Jangan mencampur dua mekanisme autentikasi tanpa
> konfigurasi yang jelas. Dokumentasi endpoint di bawah menggunakan
> Bearer Token agar kontraknya sederhana.

### 2.1 Register

Membuat akun User baru.

  Item           Value
  -------------- ------------------
  Method         POST
  Endpoint       `/auth/register`
  Access         Public
  Content-Type   application/json

**Request body:**

``` json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Success response --- 201 Created:**

``` json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "user"
    },
    "token": "1|example-token"
  }
}
```

Rules: - `name`: required, string, maksimal 255 karakter. - `email`:
required, email valid, unique. - `password`: required, minimal 8
karakter, harus cocok dengan `password_confirmation`. - Role akun yang
dibuat melalui registrasi publik selalu `user`. Client tidak boleh
menentukan role.

### 2.2 Login

Melakukan autentikasi menggunakan email dan password.

  Item       Value
  ---------- ---------------
  Method     POST
  Endpoint   `/auth/login`
  Access     Public

**Request body:**

``` json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "user"
    },
    "token": "1|example-token"
  }
}
```

Jika kredensial salah, backend mengembalikan `401 Unauthorized`.

### 2.3 Logout

Menghapus token aktif milik pengguna.

  Item       Value
  ---------- ----------------
  Method     POST
  Endpoint   `/auth/logout`
  Access     Authenticated

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Logout successful."
}
```

### 2.4 Get Current User

Mengambil informasi akun yang sedang login.

  Item       Value
  ---------- ---------------
  Method     GET
  Endpoint   `/auth/me`
  Access     Authenticated

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "user",
    "phone": null
  }
}
```

------------------------------------------------------------------------

## 3. Profile

Semua endpoint profile memerlukan autentikasi.

### 3.1 Get Profile

  Method   Endpoint     Access
  -------- ------------ ---------------
  GET      `/profile`   Authenticated

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "role": "user",
    "phone": null
  }
}
```

### 3.2 Update Profile

Memperbarui informasi profil yang diizinkan. Role dan email tidak dapat
diubah melalui endpoint ini pada rancangan versi pertama.

  Method   Endpoint     Access
  -------- ------------ ---------------
  PUT      `/profile`   Authenticated

**Request body:**

``` json
{
  "name": "Budi Santoso",
  "phone": "081234567890"
}
```

### 3.3 Change Password

  Method   Endpoint              Access
  -------- --------------------- ---------------
  PUT      `/profile/password`   Authenticated

**Request body:**

``` json
{
  "current_password": "old-password",
  "password": "new-password123",
  "password_confirmation": "new-password123"
}
```

Backend harus memverifikasi `current_password` sebelum menyimpan
password baru.

------------------------------------------------------------------------

## 4. Dashboard

Dashboard mengembalikan statistik sesuai role pengguna yang sedang
login.

### 4.1 Admin Dashboard

  Item       Value
  ---------- --------------------
  Method     GET
  Endpoint   `/admin/dashboard`
  Access     Admin

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": {
    "total_reports": 120,
    "pending_reports": 30,
    "in_progress_reports": 25,
    "completed_reports": 55,
    "rejected_reports": 10,
    "reports_by_category": {
      "organic": 40,
      "plastic": 50,
      "paper": 30
    },
    "recent_reports": []
  }
}
```

Angka di atas hanya contoh bentuk response, bukan data aktual.

### 4.2 User Dashboard

  Item       Value
  ---------- -------------------
  Method     GET
  Endpoint   `/user/dashboard`
  Access     User

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": {
    "total_reports": 12,
    "pending_reports": 3,
    "in_progress_reports": 2,
    "completed_reports": 6,
    "rejected_reports": 1,
    "recent_reports": []
  }
}
```

Statistik User hanya boleh dihitung dari laporan milik user yang sedang
login.

------------------------------------------------------------------------

## 5. Waste Reports

Kategori sampah yang didukung:

-   `organic`
-   `plastic`
-   `paper`

Status laporan:

-   `pending`
-   `in_progress`
-   `completed`
-   `rejected`

### 5.1 List Reports

Mengambil daftar laporan. Hasil dan hak akses ditentukan berdasarkan
role.

  Item       Value
  ---------- ------------------
  Method     GET
  Endpoint   `/waste-reports`
  Access     Admin, User

**Query parameters:**

  Parameter          Type        Required Description
  ------------------ --------- ---------- ---------------------------------
  `page`             integer           No Nomor halaman, default 1
  `per_page`         integer           No Jumlah data per halaman
  `search`           string            No Pencarian judul laporan
  `status`           string            No Filter status
  `waste_category`   string            No Filter kategori
  `date_from`        date              No Tanggal awal
  `date_to`          date              No Tanggal akhir
  `sort_by`          string            No Kolom pengurutan yang diizinkan
  `sort_direction`   string            No `asc` atau `desc`

Admin dapat melihat seluruh laporan. User hanya menerima laporan
miliknya sendiri. Backend tidak boleh mempercayai `user_id` yang dikirim
client untuk menentukan kepemilikan data.

**Example request:**

``` http
GET /api/waste-reports?status=pending&page=1&per_page=10
```

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": [
    {
      "id": 10,
      "user": {
        "id": 1,
        "name": "Budi Santoso"
      },
      "title": "Sampah plastik di taman",
      "description": "Terdapat beberapa botol plastik.",
      "image_url": "https://res.cloudinary.com/example/image/upload/report.jpg",
      "waste_category": "plastic",
      "confidence_score": 0.94,
      "latitude": -7.2500000,
      "longitude": 112.7500000,
      "address": "Area taman",
      "status": "pending",
      "created_at": "2026-11-03T08:30:00Z",
      "updated_at": "2026-11-03T08:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "last_page": 1
  }
}
```

### 5.2 Get Report Detail

  Method   Endpoint                Access
  -------- ----------------------- -------------------
  GET      `/waste-reports/{id}`   Admin, owner User

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": {
    "id": 10,
    "user": {
      "id": 1,
      "name": "Budi Santoso"
    },
    "title": "Sampah plastik di taman",
    "description": "Terdapat beberapa botol plastik.",
    "image_url": "https://res.cloudinary.com/example/image/upload/report.jpg",
    "waste_category": "plastic",
    "confidence_score": 0.94,
    "latitude": -7.2500000,
    "longitude": 112.7500000,
    "address": "Area taman",
    "status": "pending",
    "status_histories": [
      {
        "id": 1,
        "old_status": null,
        "new_status": "pending",
        "note": "Laporan dibuat.",
        "changed_by": null,
        "created_at": "2026-11-03T08:30:00Z"
      }
    ],
    "created_at": "2026-11-03T08:30:00Z",
    "updated_at": "2026-11-03T08:30:00Z"
  }
}
```

Jika User mencoba mengakses laporan milik orang lain, backend harus
menolak akses. Gunakan `403 Forbidden` atau `404 Not Found` sesuai
kebijakan keamanan aplikasi dan terapkan secara konsisten.

### 5.3 Classify Waste Image

Mengirim gambar ke Laravel untuk diteruskan ke FastAPI dan mendapatkan
prediksi kategori sampah. Endpoint ini tidak membuat laporan.

  Item           Value
  -------------- ---------------------------
  Method         POST
  Endpoint       `/waste-reports/classify`
  Access         Authenticated User
  Content-Type   multipart/form-data

**Form data:**

  Field     Type     Required Description
  --------- ------ ---------- ---------------
  `image`   file          Yes Gambar sampah

Format gambar dan batas ukuran file harus ditetapkan di konfigurasi
backend. Rekomendasi awal: JPG, JPEG, PNG, atau WebP dengan ukuran
maksimum 5 MB.

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Image classified successfully.",
  "data": {
    "predicted_category": "plastic",
    "confidence_score": 0.94
  }
}
```

Nilai response di atas hanya contoh. Laravel meneruskan gambar ke
FastAPI, memvalidasi response, lalu mengembalikan hasilnya kepada
frontend.

Jika layanan ML tidak tersedia, Laravel mengembalikan error yang
konsisten. User tetap dapat mencoba kembali klasifikasi. Jangan
menyimpan nilai prediksi palsu sebagai hasil AI.

### 5.4 Create Report

Membuat laporan baru. Gambar dapat diunggah ke Cloudinary oleh backend
setelah validasi. Frontend mengirim file gambar, bukan URL Cloudinary
yang dipercaya begitu saja.

  Item           Value
  -------------- ---------------------
  Method         POST
  Endpoint       `/waste-reports`
  Access         Authenticated User
  Content-Type   multipart/form-data

**Form data:**

  ----------------------------------------------------------------------------
  Field                Type                          Required Description
  -------------------- ---------------- --------------------- ----------------
  `title`              string                             Yes Judul laporan

  `description`        string                             Yes Deskripsi

  `image`              file                               Yes Foto sampah

  `waste_category`     string                             Yes Kategori akhir
                                                              yang
                                                              dikonfirmasi

  `confidence_score`   numeric                             No Hasil confidence
                                                              AI dari proses
                                                              prediksi

  `latitude`           numeric                            Yes Koordinat
                                                              lintang

  `longitude`          numeric                            Yes Koordinat bujur

  `address`            string                              No Keterangan
                                                              alamat
  ----------------------------------------------------------------------------

**Success response --- 201 Created:**

``` json
{
  "success": true,
  "message": "Report created successfully.",
  "data": {
    "id": 10,
    "title": "Sampah plastik di taman",
    "description": "Terdapat beberapa botol plastik.",
    "image_url": "https://res.cloudinary.com/example/image/upload/report.jpg",
    "waste_category": "plastic",
    "confidence_score": 0.94,
    "latitude": -7.2500000,
    "longitude": 112.7500000,
    "address": "Area taman",
    "status": "pending",
    "created_at": "2026-11-03T08:30:00Z"
  }
}
```

Rules: - `user_id` diambil dari user yang terautentikasi, bukan dari
request body. - Status awal selalu `pending`. - Backend membuat riwayat
status awal dengan `old_status = null` dan `new_status = pending`. -
`confidence_score` harus berasal dari hasil prediksi yang diterima
backend. Jangan mempercayai angka confidence yang dapat dimanipulasi
client; simpan hasil prediksi yang terikat pada proses klasifikasi atau
lakukan prediksi kembali saat submit. - Kategori akhir dapat
dikonfirmasi atau dikoreksi User sesuai PRD. - Simpan URL Cloudinary ke
`image_url`.

### 5.5 Update Report

Admin dapat memperbarui informasi laporan. User hanya dapat memperbarui
laporan miliknya selama status `pending`.

  -----------------------------------------------------------------------
  Method                  Endpoint                Access
  ----------------------- ----------------------- -----------------------
  PUT                     `/waste-reports/{id}`   Admin, owner User
                                                  dengan status pending

  -----------------------------------------------------------------------

**Request body:**

``` json
{
  "title": "Sampah plastik di taman kota",
  "description": "Terdapat botol dan kemasan plastik.",
  "waste_category": "plastic",
  "latitude": -7.2500000,
  "longitude": 112.7500000,
  "address": "Taman kota"
}
```

Untuk mengganti gambar, gunakan `multipart/form-data` dan field `image`.
Implementasi Laravel dapat memakai `POST` dengan method spoofing
`_method=PUT` jika diperlukan oleh konfigurasi upload.

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Report updated successfully.",
  "data": {
    "id": 10,
    "title": "Sampah plastik di taman kota",
    "status": "pending"
  }
}
```

Endpoint ini tidak digunakan untuk mengubah status. Perubahan status
menggunakan endpoint khusus Admin.

### 5.6 Delete Report

Admin dapat menghapus laporan. User hanya dapat menghapus laporan
miliknya sendiri selama status `pending`.

  -----------------------------------------------------------------------
  Method                  Endpoint                Access
  ----------------------- ----------------------- -----------------------
  DELETE                  `/waste-reports/{id}`   Admin, owner User
                                                  dengan status pending

  -----------------------------------------------------------------------

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Report deleted successfully."
}
```

Penghapusan record dan riwayat mengikuti kebijakan foreign key serta
kebijakan retensi data yang diterapkan backend.

### 5.7 Update Report Status

Mengubah status laporan. Hanya Admin yang dapat menggunakan endpoint
ini.

  Item       Value
  ---------- ------------------------------------
  Method     PATCH
  Endpoint   `/admin/waste-reports/{id}/status`
  Access     Admin

**Request body:**

``` json
{
  "status": "in_progress",
  "note": "Laporan diteruskan untuk penanganan."
}
```

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "message": "Report status updated successfully.",
  "data": {
    "id": 10,
    "status": "in_progress",
    "updated_at": "2026-11-03T09:00:00Z"
  }
}
```

Backend harus: 1. Memastikan pengguna memiliki role Admin. 2.
Memvalidasi status baru. 3. Mengambil status lama. 4. Memperbarui status
laporan. 5. Menambahkan riwayat status. 6. Menjalankan update dan insert
riwayat dalam satu database transaction.

------------------------------------------------------------------------

## 6. Admin User Management

Semua endpoint pada bagian ini hanya dapat diakses Admin.

### 6.1 List Users

  Method   Endpoint         Access
  -------- ---------------- --------
  GET      `/admin/users`   Admin

**Query parameters:**

  Parameter    Type        Required Description
  ------------ --------- ---------- -------------------------
  `search`     string            No Cari nama atau email
  `page`       integer           No Halaman
  `per_page`   integer           No Jumlah data per halaman

**Success response --- 200 OK:**

``` json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@example.com",
      "role": "user",
      "reports_count": 12,
      "created_at": "2026-11-03T08:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "last_page": 1
  }
}
```

### 6.2 Get User Detail

  Method   Endpoint              Access
  -------- --------------------- --------
  GET      `/admin/users/{id}`   Admin

Response berisi informasi pengguna dan ringkasan jumlah laporannya.
Jangan mengembalikan password atau token.

### 6.3 Create User

  Method   Endpoint         Access
  -------- ---------------- --------
  POST     `/admin/users`   Admin

**Request body:**

``` json
{
  "name": "Siti Aminah",
  "email": "siti@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "user"
}
```

Admin dapat membuat akun sesuai aturan role yang ditetapkan backend.
Pembuatan akun Admin harus dibatasi dan diaudit.

### 6.4 Update User

  Method   Endpoint              Access
  -------- --------------------- --------
  PUT      `/admin/users/{id}`   Admin

**Request body:**

``` json
{
  "name": "Siti Aminah",
  "phone": "081234567890",
  "role": "user"
}
```

Validasi role dan larangan mengubah akun tertentu harus diterapkan di
backend.

### 6.5 Delete User

  Method   Endpoint              Access
  -------- --------------------- --------
  DELETE   `/admin/users/{id}`   Admin

Penghapusan pengguna harus mengikuti foreign key dan kebijakan retensi
laporan. Backend sebaiknya mencegah penghapusan akun Admin terakhir.

------------------------------------------------------------------------

## 7. FastAPI --- Internal Machine Learning API

Endpoint berikut merupakan API internal antara Laravel dan FastAPI.
Endpoint ini bukan endpoint publik yang dipanggil langsung oleh browser.

Base URL development (contoh):

``` text
http://127.0.0.1:8001
```

Base URL production harus menggunakan jaringan internal atau mekanisme
komunikasi service-to-service yang aman.

### 7.1 Health Check

  Method   Endpoint    Description
  -------- ----------- -----------------------------------
  GET      `/health`   Memeriksa status ML API dan model

**Example response:**

``` json
{
  "success": true,
  "status": "healthy",
  "model_loaded": true
}
```

### 7.2 Predict Image

  Method   Endpoint     Content-Type
  -------- ------------ ---------------------
  POST     `/predict`   multipart/form-data

**Form data:**

  Field     Type     Required
  --------- ------ ----------
  `image`   file          Yes

**Example response:**

``` json
{
  "success": true,
  "prediction": {
    "category": "plastic",
    "confidence": 0.94
  }
}
```

FastAPI harus memvalidasi file gambar, ukuran file, dan menangani error
prediksi. Kategori yang dikembalikan harus salah satu dari `organic`,
`plastic`, atau `paper`.

------------------------------------------------------------------------

## 8. Authorization Matrix

  Endpoint / Feature            Public       User      Admin
  --------------------------- -------- ---------- ----------
  Register                         Yes         No         No
  Login                            Yes         No         No
  Logout                            No        Yes        Yes
  Get Current User                  No        Yes        Yes
  View / Update Own Profile         No        Yes        Yes
  User Dashboard                    No        Yes         No
  Admin Dashboard                   No         No        Yes
  List Reports                      No   Own only        All
  View Report Detail                No   Own only        All
  Classify Image                    No        Yes   Optional
  Create Report                     No        Yes         No
  Update Own Pending Report         No        Yes         No
  Delete Own Pending Report         No        Yes         No
  Update Any Report                 No         No        Yes
  Delete Any Report                 No         No        Yes
  Update Report Status              No         No        Yes
  User Management                   No         No        Yes

Otorisasi harus diterapkan di Laravel melalui middleware dan
policy/gate. Menyembunyikan menu di React.js bukan pengganti pemeriksaan
hak akses di backend.

------------------------------------------------------------------------

## 9. Standard Response Format

### 9.1 Success

``` json
{
  "success": true,
  "message": "Request successful.",
  "data": {}
}
```

### 9.2 Validation Error

HTTP `422 Unprocessable Entity`

``` json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ]
  }
}
```

### 9.3 Unauthorized

HTTP `401 Unauthorized`

``` json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### 9.4 Forbidden

HTTP `403 Forbidden`

``` json
{
  "success": false,
  "message": "You are not authorized to perform this action."
}
```

### 9.5 Not Found

HTTP `404 Not Found`

``` json
{
  "success": false,
  "message": "Resource not found."
}
```

### 9.6 Server Error

HTTP `500 Internal Server Error`

``` json
{
  "success": false,
  "message": "An unexpected error occurred."
}
```

Jangan mengirim stack trace, kredensial, token, atau detail internal
server kepada client pada production.

------------------------------------------------------------------------

## 10. HTTP Status Codes

  -----------------------------------------------------------------------
  Status Code             Meaning                 Common Use
  ----------------------- ----------------------- -----------------------
  200                     OK                      Request berhasil

  201                     Created                 Data berhasil dibuat

  204                     No Content              Operasi berhasil tanpa
                                                  response body, jika
                                                  dipilih

  401                     Unauthorized            Belum login atau token
                                                  tidak valid

  403                     Forbidden               Tidak memiliki hak
                                                  akses

  404                     Not Found               Resource tidak
                                                  ditemukan

  409                     Conflict                Konflik data, misalnya
                                                  email sudah terdaftar
                                                  (jika dipilih)

  422                     Unprocessable Entity    Validasi gagal

  429                     Too Many Requests       Rate limit terlampaui

  500                     Internal Server Error   Kesalahan server

  503                     Service Unavailable     ML service atau
                                                  dependency tidak
                                                  tersedia
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 11. Suggested Laravel Route Structure

Contoh pengelompokan route pada `routes/api.php`. Ini adalah rancangan
route, bukan kode implementasi final.

``` php
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    Route::post(
        '/waste-reports/classify',
        [WasteReportController::class, 'classify']
    );

    Route::apiResource('waste-reports', WasteReportController::class)
        ->except(['store']);

    Route::post('/waste-reports', [WasteReportController::class, 'store']);

    // Admin routes
    Route::prefix('admin')
        ->middleware('role:admin')
        ->group(function () {
            Route::get('/dashboard', [AdminDashboardController::class, 'index']);
            Route::apiResource('users', AdminUserController::class);
            Route::patch(
                '/waste-reports/{wasteReport}/status',
                [AdminWasteReportController::class, 'updateStatus']
            );
        });

    // User routes
    Route::prefix('user')
        ->middleware('role:user')
        ->group(function () {
            Route::get('/dashboard', [UserDashboardController::class, 'index']);
        });
});
```

Sesuaikan nama controller, middleware role, dan route dengan
implementasi aktual. Pastikan route status hanya tersedia bagi Admin dan
policy laporan tetap memeriksa kepemilikan data. Untuk `apiResource`,
pastikan route update dan delete tidak melewati policy tersebut.

------------------------------------------------------------------------

## 12. React.js API Integration

Frontend React.js mengakses Laravel melalui satu base URL yang
dikonfigurasi melalui environment variable.

Contoh `.env` pada frontend Vite:

``` env
VITE_API_BASE_URL=http://localhost:8000/api
```

Jangan menaruh secret Cloudinary, secret Sanctum, atau credential
FastAPI di environment variable frontend karena nilai `VITE_*` dapat
terekspos ke browser.

Contoh konfigurasi Axios:

``` ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
```

Token dapat ditambahkan melalui interceptor sesuai strategi autentikasi
yang dipilih. Untuk aplikasi production, pertimbangkan penggunaan
cookie-based Sanctum SPA authentication dengan konfigurasi CSRF dan
cookie yang benar.

Contoh pemanggilan endpoint:

``` ts
const response = await api.get("/waste-reports", {
  params: {
    page: 1,
    per_page: 10,
    status: "pending",
  },
});
```

Contoh upload gambar untuk klasifikasi:

``` ts
const formData = new FormData();
formData.append("image", file);

const response = await api.post(
  "/waste-reports/classify",
  formData
);
```

Biarkan browser/Axios menetapkan multipart boundary secara otomatis.
Jangan menetapkan header `Content-Type: multipart/form-data` secara
manual jika konfigurasi Axios/browser perlu membuat boundary.

------------------------------------------------------------------------

## 13. Security Requirements

-   Gunakan HTTPS pada production.
-   Terapkan rate limiting pada login, register, dan endpoint
    klasifikasi gambar.
-   Validasi semua input di Laravel.
-   Batasi tipe dan ukuran file upload.
-   Jangan mempercayai `user_id`, role, URL gambar, atau confidence
    score dari client tanpa validasi server.
-   Gunakan Laravel Policy/Gate untuk kepemilikan laporan.
-   Simpan credential Cloudinary dan FastAPI hanya di backend.
-   FastAPI harus dibatasi agar hanya dapat diakses oleh Laravel atau
    service yang berwenang.
-   Jangan mencatat password, token, atau data rahasia ke log.
-   Gunakan database transaction untuk perubahan status beserta
    riwayatnya.
-   Terapkan CORS hanya untuk origin frontend yang diizinkan.

------------------------------------------------------------------------

## 14. Implementation Notes and Open Decisions

Hal-hal berikut perlu diputuskan saat implementasi:

1.  **Sanctum mode:** Bearer token atau cookie-based SPA authentication.
    Contoh endpoint di dokumen ini memakai Bearer Token.
2.  **Image upload flow:** rancangan ini menggunakan React → Laravel →
    Cloudinary dan Laravel → FastAPI untuk klasifikasi. Dengan demikian,
    browser tidak perlu mengetahui secret layanan eksternal.
3.  **Prediction integrity:** confidence score harus berasal dari hasil
    prediksi yang dibuat atau diverifikasi backend, bukan angka bebas
    dari browser.
4.  **File constraints:** batas ukuran dan format gambar perlu disamakan
    antara Laravel, Cloudinary, dan FastAPI.
5.  **Status transition:** aturan transisi status yang diizinkan perlu
    ditetapkan, misalnya apakah laporan `completed` dapat dikembalikan
    ke `in_progress`.
6.  **Admin account provisioning:** tentukan cara aman membuat Admin
    pertama; jangan membuka registrasi Admin publik.
7.  **API routing:** endpoint menggunakan prefix `/api` tanpa URL
    versioning agar struktur route lebih sederhana dan praktis.

------------------------------------------------------------------------

## 15. Summary

API versi pertama mencakup autentikasi, profil, dashboard Admin dan
User, klasifikasi gambar, CRUD laporan sampah, pengelolaan status,
riwayat status, serta manajemen pengguna oleh Admin.

React.js berkomunikasi dengan Laravel REST API. Laravel mengelola data
pada MySQL dan menghubungkan sistem dengan Cloudinary serta FastAPI.
FastAPI menyediakan endpoint internal untuk prediksi gambar menggunakan
model TensorFlow/Keras.

Dokumen ini merupakan kontrak awal. Nama controller, middleware, detail
autentikasi, batas upload, dan aturan transisi status harus diselaraskan
dengan implementasi backend.

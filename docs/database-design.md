# Database Design

## Smart Waste Management System

**Version:** 1.0.0\
**Status:** Draft\
**Database:** MySQL\
**Database Name:** `smart_waste_management`

------------------------------------------------------------------------

## 1. Overview

Dokumen ini menjelaskan rancangan database untuk Smart Waste Management
System. Database digunakan untuk menyimpan akun Admin dan User, laporan
sampah, serta riwayat perubahan status laporan.

Sistem menggunakan MySQL dan diakses oleh Laravel REST API. Frontend
React.js tidak berkomunikasi langsung dengan database.

### 1.1 Technology

  Item                         Specification
  ---------------------------- --------------------------
  Database Management System   MySQL 8.0+
  Database Name                `smart_waste_management`
  Storage Engine               InnoDB
  Character Set                `utf8mb4`
  Collation                    `utf8mb4_unicode_ci`
  Backend Access               Laravel Eloquent ORM
  Authentication               Laravel Sanctum

### 1.2 Database Conventions

-   Nama tabel menggunakan bentuk plural dan `snake_case`.
-   Nama kolom menggunakan `snake_case`.
-   Primary key menggunakan `BIGINT UNSIGNED` auto increment.
-   Foreign key menggunakan tipe data yang sama dengan primary key yang
    dirujuk.
-   Waktu disimpan menggunakan `TIMESTAMP` atau `DATETIME` sesuai
    kebutuhan Laravel.
-   Nilai kategori, role, dan status menggunakan `VARCHAR` dengan
    validasi di Laravel.
-   Semua tabel utama menggunakan InnoDB agar mendukung foreign key dan
    transaksi.

------------------------------------------------------------------------

## 2. Database Scope

Database versi pertama memiliki tiga tabel bisnis utama:

  -----------------------------------------------------------------------
  Table                               Description
  ----------------------------------- -----------------------------------
  `users`                             Menyimpan akun Admin dan User

  `waste_reports`                     Menyimpan laporan sampah yang
                                      dibuat User

  `report_status_histories`           Menyimpan riwayat perubahan status
                                      laporan
  -----------------------------------------------------------------------

Laravel Sanctum juga menyediakan tabel `personal_access_tokens` untuk
autentikasi API berbasis token. Tabel ini dibuat melalui migration resmi
Sanctum, bukan dirancang sebagai tabel bisnis khusus.

------------------------------------------------------------------------

## 3. Entity Relationship

### 3.1 ERD

``` mermaid
erDiagram
    users ||--o{ waste_reports : creates
    users ||--o{ report_status_histories : changes
    waste_reports ||--o{ report_status_histories : has

    users {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        varchar role
        varchar phone
        timestamp created_at
        timestamp updated_at
    }

    waste_reports {
        bigint id PK
        bigint user_id FK
        varchar title
        text description
        varchar image_url
        varchar waste_category
        decimal confidence_score
        decimal latitude
        decimal longitude
        varchar address
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    report_status_histories {
        bigint id PK
        bigint waste_report_id FK
        bigint changed_by FK
        varchar old_status
        varchar new_status
        text note
        timestamp created_at
    }
```

### 3.2 Relationships

-   Satu User dapat membuat banyak laporan sampah.
-   Setiap laporan dimiliki oleh satu User.
-   Satu laporan dapat memiliki banyak riwayat perubahan status.
-   Satu Admin dapat membuat banyak catatan perubahan status.
-   `changed_by` dapat bernilai `NULL` untuk perubahan yang dibuat oleh
    sistem, jika diperlukan.

------------------------------------------------------------------------

## 4. Table Design

### 4.1 `users`

Menyimpan data akun Admin dan User.

  ----------------------------------------------------------------------------------
  Column                Data Type               Nullable Key           Description
  --------------------- -------------- ----------------- ------------- -------------
  `id`                  BIGINT                        No PK            ID pengguna
                        UNSIGNED                                       

  `name`                VARCHAR(255)                  No               Nama pengguna

  `email`               VARCHAR(255)                  No UNIQUE        Email untuk
                                                                       login

  `password`            VARCHAR(255)                  No               Password yang
                                                                       sudah di-hash

  `role`                VARCHAR(20)                   No INDEX         Role: `admin`
                                                                       atau `user`

  `phone`               VARCHAR(20)                  Yes               Nomor telepon

  `email_verified_at`   TIMESTAMP                    Yes               Waktu
                                                                       verifikasi
                                                                       email, jika
                                                                       kelak
                                                                       digunakan

  `remember_token`      VARCHAR(100)                 Yes               Token
                                                                       remember me
                                                                       Laravel

  `created_at`          TIMESTAMP                    Yes               Waktu data
                                                                       dibuat

  `updated_at`          TIMESTAMP                    Yes               Waktu data
                                                                       diperbarui
  ----------------------------------------------------------------------------------

**Role values:**

  Value     Description
  --------- -------------------------------
  `admin`   Pengelola sistem
  `user`    Pengguna yang membuat laporan

**Rules:**

-   Email harus unik.
-   Password wajib disimpan dalam bentuk hash menggunakan mekanisme
    Laravel.
-   Registrasi publik hanya boleh membuat akun dengan role `user`.
-   Pembuatan atau perubahan role `admin` harus dibatasi melalui proses
    yang hanya dapat dilakukan pihak berwenang.
-   Jangan menerima nilai `role` dari request registrasi publik.

### 4.2 `waste_reports`

Menyimpan laporan sampah yang dikirim oleh User.

  -----------------------------------------------------------------------------------
  Column               Data Type                Nullable Key           Description
  -------------------- --------------- ----------------- ------------- --------------
  `id`                 BIGINT UNSIGNED                No PK            ID laporan

  `user_id`            BIGINT UNSIGNED                No FK, INDEX     Pemilik
                                                                       laporan

  `title`              VARCHAR(255)                   No               Judul laporan

  `description`        TEXT                           No               Deskripsi
                                                                       kondisi sampah

  `image_url`          VARCHAR(500)                   No               URL gambar
                                                                       dari
                                                                       Cloudinary

  `waste_category`     VARCHAR(30)                    No INDEX         Kategori
                                                                       sampah yang
                                                                       dikonfirmasi

  `confidence_score`   DECIMAL(5,4)                  Yes               Confidence
                                                                       prediksi AI,
                                                                       rentang 0--1

  `latitude`           DECIMAL(10,7)                  No               Koordinat
                                                                       lintang

  `longitude`          DECIMAL(10,7)                  No               Koordinat
                                                                       bujur

  `address`            VARCHAR(500)                  Yes               Alamat atau
                                                                       keterangan
                                                                       lokasi

  `status`             VARCHAR(20)                    No INDEX         Status
                                                                       penanganan
                                                                       laporan

  `created_at`         TIMESTAMP                     Yes               Waktu laporan
                                                                       dibuat

  `updated_at`         TIMESTAMP                     Yes               Waktu laporan
                                                                       diperbarui
  -----------------------------------------------------------------------------------

**Waste category values:**

  Value       Description
  ----------- ----------------
  `organic`   Sampah organik
  `plastic`   Sampah plastik
  `paper`     Sampah kertas

**Status values:**

  Value           Description
  --------------- ------------------------------------------------
  `pending`       Laporan baru diterima dan menunggu pemeriksaan
  `in_progress`   Laporan sedang ditangani
  `completed`     Laporan selesai ditangani
  `rejected`      Laporan ditolak oleh Admin

**Rules:**

-   `user_id` mengacu pada `users.id`.
-   User hanya dapat melihat laporan miliknya sendiri.
-   Admin dapat melihat dan mengelola seluruh laporan.
-   User hanya dapat mengubah atau menghapus laporan miliknya ketika
    status masih `pending`.
-   Perubahan status hanya dapat dilakukan oleh Admin.
-   `confidence_score` menyimpan confidence dari prediksi AI, bukan
    nilai yang diinput atau diubah oleh User.
-   `waste_category` menyimpan kategori akhir yang dikonfirmasi pada
    laporan. Jika User mengoreksi hasil AI, nilai confidence tetap
    merepresentasikan prediksi asli AI, bukan tingkat keyakinan atas
    pilihan User.
-   `latitude` harus berada pada rentang -90 sampai 90.
-   `longitude` harus berada pada rentang -180 sampai 180.
-   URL gambar disimpan di database, sedangkan file gambar disimpan di
    Cloudinary.

**Catatan pengembangan:** Jika nantinya perlu menyimpan kategori
prediksi AI secara terpisah dari kategori akhir yang dikonfirmasi User,
tambahkan kolom `predicted_category`. Untuk rancangan awal ini, kolom
tersebut belum diperlukan.

### 4.3 `report_status_histories`

Menyimpan setiap perubahan status laporan agar perkembangan penanganan
dapat ditelusuri.

  -------------------------------------------------------------------------------
  Column              Data Type              Nullable Key           Description
  ------------------- ------------- ----------------- ------------- -------------
  `id`                BIGINT                       No PK            ID riwayat
                      UNSIGNED                                      

  `waste_report_id`   BIGINT                       No FK, INDEX     Laporan
                      UNSIGNED                                      terkait

  `changed_by`        BIGINT                      Yes FK, INDEX     User/Admin
                      UNSIGNED                                      yang
                                                                    melakukan
                                                                    perubahan

  `old_status`        VARCHAR(20)                 Yes               Status
                                                                    sebelumnya

  `new_status`        VARCHAR(20)                  No               Status
                                                                    setelah
                                                                    perubahan

  `note`              TEXT                        Yes               Catatan
                                                                    perubahan
                                                                    status

  `created_at`        TIMESTAMP                   Yes               Waktu
                                                                    perubahan
  -------------------------------------------------------------------------------

**Rules:**

-   Setiap perubahan status laporan harus membuat satu record riwayat.
-   `old_status` bernilai `NULL` pada riwayat awal ketika laporan
    dibuat.
-   `new_status` wajib berisi status setelah perubahan.
-   `changed_by` mengacu pada `users.id`.
-   `changed_by` dapat `NULL` jika perubahan dilakukan otomatis oleh
    sistem.
-   Riwayat status tidak boleh diubah atau dihapus melalui fitur biasa
    setelah tercatat.

### 4.4 `personal_access_tokens`

Tabel ini digunakan oleh Laravel Sanctum untuk menyimpan token
autentikasi API.

Buat tabel menggunakan migration resmi Sanctum:

``` bash
php artisan install:api
```

Jangan membuat tabel ini secara manual jika migration Sanctum sudah
menyediakannya. Struktur kolom dapat mengikuti versi Sanctum yang
dipasang pada project.

------------------------------------------------------------------------

## 5. Index Design

Index digunakan untuk membantu pencarian, filter, relasi, dan
pagination.

  ------------------------------------------------------------------------------
  Table                       Index                      Purpose
  --------------------------- -------------------------- -----------------------
  `users`                     UNIQUE(`email`)            Mencegah email duplikat
                                                         dan mempercepat
                                                         pencarian login

  `users`                     INDEX(`role`)              Filter pengguna
                                                         berdasarkan role

  `waste_reports`             INDEX(`user_id`)           Mengambil laporan milik
                                                         User

  `waste_reports`             INDEX(`status`)            Filter laporan
                                                         berdasarkan status

  `waste_reports`             INDEX(`waste_category`)    Filter berdasarkan
                                                         kategori

  `waste_reports`             INDEX(`created_at`)        Pengurutan laporan
                                                         berdasarkan tanggal

  `waste_reports`             INDEX(`user_id`, `status`, Mendukung riwayat dan
                              `created_at`)              dashboard User

  `report_status_histories`   INDEX(`waste_report_id`,   Mengambil riwayat
                              `created_at`)              laporan secara
                                                         berurutan

  `report_status_histories`   INDEX(`changed_by`)        Mencari aktivitas
                                                         berdasarkan pengguna
                                                         yang mengubah
  ------------------------------------------------------------------------------

Catatan: `user_id` dan `waste_report_id` sudah memiliki index jika
dibuat sebagai foreign key oleh migration Laravel/MySQL. Periksa
migration aktual agar tidak membuat index duplikat.

------------------------------------------------------------------------

## 6. Foreign Key Constraints

  -----------------------------------------------------------------------------------------------
  Child Table                 Column              Parent Table      Parent Column  On Delete
  --------------------------- ------------------- ----------------- -------------- --------------
  `waste_reports`             `user_id`           `users`           `id`           RESTRICT

  `report_status_histories`   `waste_report_id`   `waste_reports`   `id`           CASCADE

  `report_status_histories`   `changed_by`        `users`           `id`           SET NULL
  -----------------------------------------------------------------------------------------------

**Pertimbangan:**

-   `RESTRICT` pada `waste_reports.user_id` mencegah akun dihapus ketika
    masih memiliki laporan. Ini membantu menjaga kepemilikan dan jejak
    data.
-   `CASCADE` pada `report_status_histories.waste_report_id` menghapus
    riwayat jika laporan benar-benar dihapus.
-   `SET NULL` pada `changed_by` mempertahankan riwayat meskipun akun
    pelaku perubahan dihapus.
-   Penghapusan akun dan laporan harus tetap dikontrol melalui business
    logic Laravel.

------------------------------------------------------------------------

## 7. Data Validation Rules

Validasi utama dilakukan di Laravel, bukan hanya mengandalkan database.

  -----------------------------------------------------------------------
  Field                               Validation
  ----------------------------------- -----------------------------------
  `users.name`                        Required, string, maximum 255
                                      characters

  `users.email`                       Required, valid email, unique

  `users.password`                    Required on registration, hashed
                                      before storage

  `users.role`                        Only `admin` or `user`; controlled
                                      by backend

  `waste_reports.title`               Required, string, maximum 255
                                      characters

  `waste_reports.description`         Required, string

  `waste_reports.image_url`           Required, valid URL

  `waste_reports.waste_category`      Only `organic`, `plastic`, or
                                      `paper`

  `waste_reports.confidence_score`    Nullable, numeric, between 0 and 1

  `waste_reports.latitude`            Numeric, between -90 and 90

  `waste_reports.longitude`           Numeric, between -180 and 180

  `waste_reports.status`              Only `pending`, `in_progress`,
                                      `completed`, or `rejected`
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 8. Database Migration Order

Buat migration dalam urutan berikut agar foreign key dapat dibuat
setelah tabel induk tersedia.

1.  `create_users_table`
2.  `create_waste_reports_table`
3.  `create_report_status_histories_table`
4.  Migration resmi Laravel Sanctum untuk `personal_access_tokens` (jika
    belum dibuat oleh instalasi API)

Contoh perintah:

``` bash
php artisan make:migration create_waste_reports_table
php artisan make:migration create_report_status_histories_table
```

Tabel `users` biasanya sudah dibuat oleh migration bawaan Laravel.
Periksa migration yang tersedia sebelum membuat migration baru.

Jalankan migration:

``` bash
php artisan migrate
```

------------------------------------------------------------------------

## 9. Laravel Database Configuration

Buat database terlebih dahulu di MySQL:

``` sql
CREATE DATABASE smart_waste_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Konfigurasi `.env` Laravel:

``` env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_waste_management
DB_USERNAME=root
DB_PASSWORD=
```

Sesuaikan `DB_USERNAME` dan `DB_PASSWORD` dengan konfigurasi MySQL di
lingkungan pengembangan.

Setelah mengubah konfigurasi, jalankan:

``` bash
php artisan config:clear
php artisan migrate
```

------------------------------------------------------------------------

## 10. Data Lifecycle

### 10.1 Create Report

1.  User mengirim data laporan melalui React.js.
2.  Laravel memvalidasi data dan autentikasi User.
3.  Laravel menerima URL gambar yang sudah diunggah ke Cloudinary.
4.  Laravel menyimpan laporan dengan status awal `pending`.
5.  Laravel membuat record awal pada `report_status_histories` dengan
    `old_status = NULL` dan `new_status = pending`.
6.  Laravel mengembalikan data laporan kepada frontend.

### 10.2 Update Report Status

1.  Admin memilih laporan.
2.  Admin mengirim status baru dan catatan (jika ada).
3.  Laravel memeriksa hak akses Admin.
4.  Laravel membaca status lama.
5.  Laravel memperbarui `waste_reports.status`.
6.  Laravel menambahkan record ke `report_status_histories`.
7.  Kedua operasi database dilakukan dalam satu transaction agar data
    laporan dan riwayat tetap konsisten.

### 10.3 Delete Report

-   Admin dapat menghapus laporan sesuai kebijakan sistem.
-   User hanya dapat menghapus laporan miliknya sendiri ketika status
    masih `pending`.
-   Penghapusan laporan dan riwayatnya harus mengikuti foreign key dan
    business logic yang telah ditentukan.
-   Jika membutuhkan audit trail jangka panjang, pertimbangkan soft
    delete atau kebijakan arsip sebelum implementasi penghapusan
    permanen.

------------------------------------------------------------------------

## 11. Security and Data Integrity

-   Semua akses database dilakukan melalui Laravel REST API.
-   React.js tidak boleh terhubung langsung ke MySQL.
-   Password harus di-hash dan tidak pernah disimpan dalam bentuk teks
    biasa.
-   Endpoint laporan harus menerapkan authorization berdasarkan pemilik
    laporan dan role.
-   Validasi data dilakukan di backend.
-   Perubahan status laporan dan pencatatan riwayat dilakukan dalam
    database transaction.
-   Foreign key digunakan untuk menjaga integritas relasi.
-   Kredensial database disimpan dalam environment variables dan tidak
    dimasukkan ke repository.
-   Token Sanctum tidak boleh ditampilkan atau disimpan dalam log
    aplikasi.

------------------------------------------------------------------------

## 12. Design Decisions and Future Considerations

Hal-hal berikut belum termasuk kebutuhan wajib versi pertama dan dapat
dipertimbangkan jika kebutuhan berkembang:

1.  **Soft Deletes:** Tambahkan `deleted_at` pada tabel yang memerlukan
    pemulihan data setelah penghapusan.
2.  **Predicted Category:** Tambahkan `predicted_category` jika sistem
    perlu membedakan hasil AI dan kategori akhir yang dikonfirmasi User.
3.  **Multiple Images:** Buat tabel `waste_report_images` jika satu
    laporan nantinya dapat memiliki lebih dari satu foto.
4.  **Notifications:** Buat tabel notifikasi jika fitur pemberitahuan
    perubahan status akan dikembangkan.
5.  **Geospatial Queries:** Pertimbangkan tipe data spasial MySQL jika
    pencarian laporan berdasarkan radius atau area menjadi kebutuhan.

Fitur-fitur tersebut tidak perlu ditambahkan sebelum kebutuhan versi
pertama benar-benar memerlukannya.

------------------------------------------------------------------------

## 13. Summary

Rancangan database versi pertama menggunakan MySQL dengan tiga tabel
bisnis utama: `users`, `waste_reports`, dan `report_status_histories`.
Laravel Sanctum menyediakan tabel token autentikasi secara terpisah.

Desain ini mendukung kebutuhan utama sistem: autentikasi Admin dan User,
pembuatan laporan sampah, klasifikasi kategori sampah, penyimpanan
lokasi, pengelolaan status, serta pencatatan riwayat perubahan status.

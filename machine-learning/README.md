# Smart Waste Management - Machine Learning Service (FastAPI)

Service internal Machine Learning berbasis **FastAPI** untuk mengklasifikasikan foto sampah ke dalam 3 kategori:
* **`organic`** (sampah organik, sisa makanan, daun, sayuran)
* **`plastic`** (botol plastik, gelas plastik, kantong kresek, kemasan)
* **`paper`** (kardus, kertas dokumen, karton)

Service ini berjalan di port `8001` dan dipanggil secara internal oleh Backend Laravel melalui service `MlPredictionService.php`.

---

## Cara Menjalankan Service

Anda tidak perlu menghafal banyak perintah Python. Cukup ikuti salah satu cara berikut:

### Cara 1: Menggunakan Script Otomatis (Paling Mudah)
Buka terminal dan jalankan:
```bash
cd machine-learning
./run.sh
```
Script ini akan otomatis:
1. Membuat virtual environment Python (`venv`) jika belum ada.
2. Mengaktifkan `venv`.
3. Menginstal semua dependensi dari `requirements.txt`.
4. Menjalankan server di `http://127.0.0.1:8001` dengan fitur auto-reload.

---

### Cara 2: Langkah Manual (Standar Python)
Jika ingin menjalankan langkah demi langkah secara manual:
```bash
cd machine-learning

# 1. Aktifkan virtual environment
source venv/bin/activate

# 2. Instal dependensi (hanya perlu saat pertama kali)
pip install -r requirements.txt

# 3. Jalankan server FastAPI
uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

Untuk menghentikan server, tekan `Ctrl + C` di terminal.

---

## Dokumentasi API & Uji Coba Interaktif

Setelah server berjalan, Anda dapat membuka browser untuk melihat dokumentasi interaktif bawaan Swagger:
* **Swagger UI**: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)
* **ReDoc**: [http://127.0.0.1:8001/redoc](http://127.0.0.1:8001/redoc)

Di Swagger UI, Anda bisa langsung mengunggah foto sampah untuk menguji endpoint `/predict` tanpa perlu menulis kode apa pun!

---

## Endpoint API

### 1. Health Check
* **Method**: `GET`
* **URL**: `http://127.0.0.1:8001/health`
* **Response**:
```json
{
  "success": true,
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

### 2. Predict Image
* **Method**: `POST`
* **URL**: `http://127.0.0.1:8001/predict`
* **Content-Type**: `multipart/form-data`
* **Form Field**: `image` (file gambar JPG, PNG, WEBP, maks. 5MB)
* **Response**:
```json
{
  "success": true,
  "prediction": {
    "category": "plastic",
    "confidence": 0.9452
  }
}
```

---

## Struktur Folder

```text
machine-learning/
├── app/
│   ├── config.py           # Konfigurasi port, batasan ukuran file, MIME type
│   ├── schemas.py          # Format data input & output (Pydantic)
│   ├── routes/
│   │   ├── health.py       # Endpoint GET /health
│   │   └── predict.py      # Endpoint POST /predict
│   └── services/
│       ├── validator.py    # Validasi tipe file, ukuran, dan integritas gambar
│       └── classifier.py   # Logika inferensi klasifikasi sampah
├── tests/
│   └── test_api.py         # Pengujian otomatis endpoint
├── main.py                 # File utama FastAPI & CORS
├── requirements.txt        # Daftar library Python
├── run.sh                  # Script satu klik untuk menjalankan server
└── README.md               # Panduan ini
```

---

## Menjalankan Unit Test

Untuk memastikan seluruh endpoint bekerja dengan benar:
```bash
cd machine-learning
source venv/bin/activate
pytest tests/
```


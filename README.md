# Smart Waste Management System

A web-based intelligent waste reporting and monitoring system equipped with AI-powered waste image classification.

---

## 🏗️ System Architecture & Tech Stack

- **Frontend:** React + Vite + TypeScript, Tailwind CSS, shadcn/ui (`apps/`)
- **Backend:** Laravel 11 REST API with Laravel Sanctum (`backend/api`)
- **Database:** MySQL 8.0+
- **Machine Learning:** FastAPI + Python (TensorFlow / MobileNetV2) (`machine-learning/`)
- **Storage:** Cloudinary CDN

---

## 📁 Repository Structure

```text
smart-waste-management/
├── apps/                 # Frontend Web Application (React + Vite)
├── backend/
│   └── api/              # Laravel REST API & Sanctum Auth
├── docs/                 # System Documentation & Specifications
│   ├── PRD.md            # Product Requirements Document
│   ├── api-documentation.md
│   ├── database-design.md
│   ├── system-architecture.md
│   └── postman/          # Ready-to-import Postman Collection & Environment
└── machine-learning/     # AI Classification Microservice (FastAPI)
```

---

## 🚀 Getting Started

### 1. Backend (Laravel API)
```bash
cd backend/api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Run test suite:
```bash
php artisan test
```

### 2. API Documentation & Postman
- Complete API spec is available at `docs/api-documentation.md`.
- Postman Collection and Environment are available in `docs/postman/`.

---

## 👥 Roles & Permissions
- **Admin:** Manages reports, updates status, and manages users.
- **User:** Creates reports, uploads waste photos, uses AI classification preview, and tracks status.


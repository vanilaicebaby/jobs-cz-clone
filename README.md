# BMW Carbon Parts E-shop - KOMPLETNÍ VERZE

Minimalistická, vizuálně atraktivní webová aplikace pro prodej luxusních karbonových komponentů pro BMW M vozidla.

## 🎯 Hlavní Features

### ✅ Implementované funkce

- **Homepage**: Čistý produktový grid (4 sloupce) + Category tiles
- **Product Detail**: Galerie obrázků, specifikace, smooth transitions
- **Košík (Cart)**: Správa produktů, aktualizace množství, perzistence
- **Checkout**: Kompletní formulář objednávky s validací
- **Autentizace**: Login/Registrace s Google OAuth připraveným
- **Responzivní design**: Mobile-first přístup
- **Animace**: Smooth fade-in, hover efekty, skeleton loading
- **Footer**: Kompletní s odkazy, kontakty, social media

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigace
- **Context API** - State management (košík)
- **LocalStorage** - Perzistence košíku

### Backend
- **Node.js + Express** - REST API
- **Mock data** - POC data (připraveno pro DynamoDB)

## 🛠️ Instalace a Spuštění

### Předpoklady
- Node.js 21.x
- npm

### 1. Instalace Dependencies

```bash
# Root level
npm install

# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Spuštění Development Serveru

```bash
# Z root složky - spustí frontend i backend
npm run dev

# Nebo samostatně:
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3001
```

### 3. Otevření Aplikace

Otevřete prohlížeč na: **http://localhost:5173**

## 🎨 Design System

### Barvy
- Hlavní: Černá (#000000)
- Pozadí: Bílá (#ffffff)
- Šedá: #f9fafb, #e5e7eb, #4b5563, #111827

### Typografie
- Font Family: Inter (Google Fonts)
- Font Weights: 300 (light), 400 (normal), 500 (medium)

## 📦 Klíčové Stránky

### Pages

**Homepage** (`/`)
- Category tiles nahoře (Exteriér, Interiér, Performance, Akce -20%)
- Produktový grid (4 sloupce na desktopu)
- Skeleton loading states
- Staggered fade-in animace
- Add to Cart tlačítko s vizuálním feedbackem
- Klik na produkt → detail

**ProductDetail** (`/product/:id`)
- Galerie obrázků (4 thumbnails)
- Technické specifikace
- Features list
- Add to Cart + Buy Now
- Výběr množství

**CartPage** (`/cart`)
- Seznam produktů v košíku
- Aktualizace množství (+/-)
- Odstranění produktu
- Souhrn ceny
- Doprava ZDARMA nad 10 000 Kč

**CheckoutPage** (`/checkout`)
- Kontaktní údaje
- Dodací adresa
- Způsob platby
- Souhrn objednávky

**LoginPage** (`/login`)
- Email + Heslo
- Google OAuth tlačítko
- Link na registraci

**RegisterPage** (`/register`)
- Jméno, Email, Heslo
- Google OAuth tlačítko
- Link na přihlášení

## 📊 API Endpoints

### GET /api/products
Vrací seznam všech produktů

### GET /api/products/:id
Vrací detail produktu

### GET /health
Health check endpoint

## 🌐 Production Deployment

**Frontend**: AWS Amplify / S3 + CloudFront
**Backend**: Lambda + API Gateway / EC2
**Database**: DynamoDB

📋 **Detailní checklist pro produkci viz [PRODUCTION_READY.md](PRODUCTION_READY.md)**

Obsahuje kompletní seznam věcí k doplnění:
- Firemní údaje (adresa, telefon, email, IČO/DIČ)
- Připojení databáze
- Nahrání skutečných produktů a fotek
- Platební brána
- Email notifikace
- a další...

## 📝 Změny od POC

### Nové Features:
✅ Kompletní košík s perzistencí
✅ Checkout proces
✅ Login/Registrace
✅ Google OAuth připraveno
✅ Cart management (Context API)
✅ Buy Now funkce

### Design Updates:
✅ Čistý minimalistický styl (Bimmer Euro inspired)
✅ Fixní velikost produktových karet
✅ Černé CTA tlačítka
✅ Bílé/šedé barvy

## 📧 Kontakt

Pro dotazy: info@bmwcarbon.cz

---

**Verze**: 2.0 (Kompletní)
**Datum**: 2025-11-05
**Status**: Production Ready POC

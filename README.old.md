# BMW Carbon Parts E-shop - POC

Minimalistická, vizuálně atraktivní webová aplikace pro prodej luxusních karbonových komponentů pro BMW M vozidla.

## 🎨 Design Koncepce

- **Estetika**: Moderní, čistý design s důrazem na vizuální kvalitu
- **Barevná Paleta**:
  - Tmavá (Dark Charcoal #1a1a1a)
  - Rose Gold akcenty (#B76E79)
  - Světlé pozadí (#f5f5f5)
- **Typografie**: Inter - moderní, tenké, bezpatkové písmo
- **Styl**: Prémiový vzhled odpovídající luxusnímu segmentu

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool a dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing
- **Axios** - HTTP klient

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **CORS** - Cross-origin resource sharing

### Budoucí Integrace
- **AWS DynamoDB** - NoSQL databáze
- **AWS S3** - Úložiště obrázků
- **AWS Lambda** - Serverless funkce
- **AWS Amplify/EC2** - Hosting

## 📁 Struktura Projektu

```
carshop/
├── frontend/                 # React aplikace
│   ├── src/
│   │   ├── components/      # Reusable komponenty
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── pages/           # Page komponenty
│   │   │   ├── HomePage.jsx
│   │   │   └── ProductDetail.jsx
│   │   ├── services/        # API služby
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js API
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example
│
├── package.json            # Root package.json
└── README.md
```

## 🔥 Klíčové Funkce

### Homepage
- **Hero Sekce**: Velká foto/video sekce s dramatickým vzhledem
- **Produktový Výpis**: 8 nejprodávanějších produktů v dlaždicích (3-4 v řadě)
- **O Nás Sekce**: Prezentace filozofie kvality
- **Kontakt Sekce**: Rychlý kontakt

### Produktové Dlaždice
- Velký kvalitní obrázek produktu
- Název produktu a kategorie
- Cena (výrazně zobrazená)
- 2 CTA tlačítka:
  - "DO KOŠÍKU" (primární - rose gold)
  - "DETAIL" (sekundární - outline)

### Detail Produktu
- Galerie obrázků (4 fotky s thumbnail navigací)
- Technické specifikace
- Seznam výhod/features
- Výběr množství
- CTA tlačítka (Do košíku, Dotaz k produktu)
- Informace o expedici a záruce

## 🛠️ Instalace a Spuštění

### Předpoklady
- Node.js 21.x nebo vyšší
- npm nebo yarn

### 1. Instalace Dependencies

```bash
# Instalace všech dependencies (root + frontend + backend)
npm run install:all

# Nebo manuálně:
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Nastavení Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Spuštění Development Serveru

```bash
# Spustí frontend i backend současně
npm run dev

# Nebo samostatně:
npm run dev:frontend  # Frontend na http://localhost:5173
npm run dev:backend   # Backend na http://localhost:3001
```

### 4. Otevření Aplikace

Otevřete prohlížeč na adrese: **http://localhost:5173**

## 📦 Build pro Production

### Frontend Build
```bash
cd frontend
npm run build
# Build output bude v: frontend/dist/
```

### Backend pro Production
```bash
cd backend
npm start
```

## 🌐 AWS Deployment (Budoucí)

### Varianta 1: AWS Amplify + Lambda + DynamoDB
```bash
# Frontend: AWS Amplify Hosting
# Backend: AWS Lambda + API Gateway
# Database: DynamoDB
# Storage: S3

# 1. Instalace Amplify CLI
npm install -g @aws-amplify/cli

# 2. Inicializace Amplify
amplify init

# 3. Přidání hostingu
amplify add hosting

# 4. Deploy
amplify publish
```

### Varianta 2: EC2 + RDS/DynamoDB
```bash
# Frontend: S3 + CloudFront
# Backend: EC2 instance
# Database: DynamoDB

# 1. Build frontend
cd frontend && npm run build

# 2. Upload do S3
aws s3 sync dist/ s3://your-bucket-name

# 3. Deploy backend na EC2
# - SSH do instance
# - Clone repository
# - npm install
# - pm2 start server.js
```

## 🔄 DynamoDB Integrace (Připraveno)

Backend je připraven pro snadnou integraci s AWS DynamoDB.

### Kroky pro integraci:

1. **Instalace AWS SDK**
```bash
cd backend
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

2. **Vytvoření DynamoDB tabulky**
```bash
aws dynamodb create-table \
  --table-name bmw-carbon-products \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

3. **Update server.js** - nahradit mockProducts voláním DynamoDB

## 📋 API Endpoints

### GET /api/products
Vrací seznam všech produktů
```json
[
  {
    "id": "1",
    "name": "Karbonový Difuzor...",
    "category": "BMW M4 G82 | Exteriér",
    "price": 45900,
    "image": "url",
    "isNew": true
  }
]
```

### GET /api/products/:id
Vrací detail produktu
```json
{
  "id": "1",
  "name": "Karbonový Difuzor...",
  "category": "BMW M4 G82 | Exteriér",
  "price": 45900,
  "images": ["url1", "url2", ...],
  "description": "...",
  "specifications": [...],
  "features": [...]
}
```

### GET /health
Health check endpoint
```json
{
  "status": "OK",
  "timestamp": "2025-11-05T..."
}
```

## 🎯 Budoucí Vylepšení

- [ ] Košík a checkout proces
- [ ] Uživatelská registrace/přihlášení
- [ ] Admin panel pro správu produktů
- [ ] Payment gateway integrace (Stripe/GoPay)
- [ ] Pokročilé filtrování produktů
- [ ] Wishlist
- [ ] Product reviews
- [ ] Email notifikace
- [ ] Sledování objednávek
- [ ] Multi-jazyk podpora (CZ/EN)

## 🎨 Design System

### Barvy
```css
--rose-gold: #B76E79
--dark-charcoal: #1a1a1a
--soft-gray: #2d2d2d
--light-gray: #f5f5f5
```

### Typografie
- Font Family: Inter (Google Fonts)
- Font Weights: 100-700
- Heading: font-light (300) / font-normal (400)
- Body: font-light (300)

### Spacing
- Používá Tailwind spacing scale (4px base)
- Konzistentní padding/margin

## 📸 Screenshots Preview

### Homepage
- Hero sekce s dramatickým BMW M4 obrázkem
- Grid produktových karet (4 v řadě na desktopu)
- Filosofie kvality sekce
- Kontaktní sekce

### Product Detail
- Galerie s 4 obrázky
- Technické specifikace
- Seznam features
- Add to cart funkce

## 🤝 Contributing

Toto je POC projekt. Pro přidání nových features:

1. Vytvořte novou větev
2. Implementujte změny
3. Otestujte lokálně
4. Vytvořte pull request

## 📝 License

Private project - All rights reserved

## 📧 Kontakt

Pro dotazy ohledně projektu:
- Email: info@bmwcarbon.cz

---

**POC vytvořen**: 2025-11-05
**Stack**: React + Node.js + Tailwind CSS
**Připraveno pro**: AWS Deployment

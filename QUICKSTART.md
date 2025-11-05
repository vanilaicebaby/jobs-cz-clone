# 🚀 Quick Start Guide

Rychlý návod pro spuštění projektu během 5 minut.

## ✅ Předpoklady

- Node.js 21.x nebo vyšší
- npm 10.x nebo vyšší

## 📦 Instalace (1 minuta)

```bash
# 1. Klonujte/otevřete projekt
cd carshop

# 2. Instalace všech dependencies
npm run install:all
```

## ⚙️ Konfigurace (30 sekund)

```bash
# Vytvořte .env soubory z příkladů
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Není třeba nic měnit - výchozí hodnoty fungují!

## 🎬 Spuštění (10 sekund)

```bash
# Spustí frontend (port 5173) i backend (port 3001) současně
npm run dev
```

Aplikace se automaticky otevře v prohlížeči na: **http://localhost:5173**

## 🎉 Hotovo!

Měli byste vidět:
- Tmavý navbar nahoře s logem "BMW|CARBON"
- Hero sekci s velkým obrázkem BMW
- Grid 8 produktových karet
- Footer dole

## 🔍 Co dále?

### Vyzkoušejte funkcionalitu:
- ✅ Klikněte na "DETAIL" u produktu → Otevře detail produktu
- ✅ Prohlédněte si galerii obrázků
- ✅ Změňte množství
- ✅ Přejděte zpět na homepage

### Customizace:
- Změňte barvy v `frontend/tailwind.config.js`
- Upravte produkty v `backend/server.js` (mockProducts)
- Přidejte vlastní obrázky (nahraďte Unsplash URL)

## 🐛 Troubleshooting

### Port již používán?
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Dependencies issue?
```bash
# Smazat node_modules a reinstalovat
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

### Frontend se nenačte?
```bash
# Zkontrolujte, že backend běží
curl http://localhost:3001/health

# Mělo by vrátit:
# {"status":"OK","timestamp":"..."}
```

## 📱 Test na Mobilu

```bash
# Zjistěte lokální IP
# Windows:
ipconfig

# Frontend bude dostupný na:
http://YOUR_LOCAL_IP:5173
```

## 🎨 Design Tips

### Změna barev:
Upravte `frontend/tailwind.config.js`:
```javascript
colors: {
  'rose-gold': '#B76E79',  // Změňte zde!
  'dark-charcoal': '#1a1a1a',
  // ...
}
```

### Změna písma:
Upravte `frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap');

body {
  font-family: 'YOUR_FONT', sans-serif;
}
```

## 📸 Přidání vlastních obrázků

### Option 1: Lokální obrázky
```bash
# 1. Přidejte obrázky do:
frontend/public/images/

# 2. Použijte v kódu:
image: '/images/my-product.jpg'
```

### Option 2: Cloud (S3)
```bash
# Upload do S3
aws s3 cp my-image.jpg s3://your-bucket/products/

# Použijte URL:
image: 'https://your-bucket.s3.amazonaws.com/products/my-image.jpg'
```

## 🚀 Production Build

```bash
# Build frontend
cd frontend
npm run build

# Výstup bude v: frontend/dist/
# Ready pro deploy na S3, Netlify, Vercel, atd.
```

## 💡 Next Steps

1. Přečtěte [README.md](README.md) pro detailní dokumentaci
2. Prohlédněte [DEPLOYMENT.md](DEPLOYMENT.md) pro AWS deployment
3. Začněte customizovat!

---

Užijte si vývoj! 🎉

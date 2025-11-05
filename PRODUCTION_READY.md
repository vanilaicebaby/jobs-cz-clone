# BMW Carbon Parts E-shop - Production Ready Checklist

## ✅ Hotové funkce

### Frontend
- ✅ Minimalistický, designový vzhled
- ✅ Responzivní design (mobile, tablet, desktop)
- ✅ Plně funkční nákupní košík s localStorage persistence
- ✅ Produktový katalog s animacemi
- ✅ Detailní stránky produktů s galerií
- ✅ Checkout proces s formulářem
- ✅ Login a Registrace (připraveno pro Google OAuth)
- ✅ Category tiles (Exteriér, Interiér, Performance, Akce)
- ✅ Skeleton loading states
- ✅ Smooth animace a transitions
- ✅ Hover efekty na všech interaktivních prvcích

### Backend
- ✅ Express API server
- ✅ Mock data pro 8 produktů
- ✅ Endpoints: GET /api/products, GET /api/products/:id

### Komponenty
- ✅ Navbar s košíkem a badge counter
- ✅ ProductCard s animacemi
- ✅ Footer s kompletními informacemi
- ✅ Všechny stránky: Home, ProductDetail, Cart, Checkout, Login, Register

---

## 📝 CO JE POTŘEBA DOPLNIT PRO PRODUKCI

### 1. **Firemní údaje v Footeru**
Soubor: `frontend/src/components/Footer.jsx`

Nahraď tyto placeholdery:
```
[DOPLŇ ADRESU FIRMY] → např. "Pražská 123, 110 00 Praha 1"
[DOPLŇ TELEFON] → např. "+420 123 456 789"
[DOPLŇ EMAIL] → např. "info@bmwcarbon.cz"
[DOPLŇ IČO A DIČ FIRMY] → např. "IČO: 12345678 | DIČ: CZ12345678"
[DOPLŇ FACEBOOK URL] → např. "https://facebook.com/vase-stranka"
[DOPLŇ INSTAGRAM URL] → např. "https://instagram.com/vase-stranka"
```

### 2. **Backend - připojení k databázi**
Soubor: `backend/server.js`

Aktuálně: Mock data
Potřeba: Připojit DynamoDB nebo jinou databázi

```javascript
// Nahraď mock data v server.js za skutečné DB dotazy
// Příklad pro DynamoDB AWS SDK v3:
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-central-1' });
const docClient = DynamoDBDocumentClient.from(client);

// GET /api/products
const command = new ScanCommand({ TableName: 'Products' });
const response = await docClient.send(command);
```

### 3. **Produktová data**
Aktuálně: 8 mock produktů
Potřeba: Nahrát skutečné produkty do databáze

Struktura produktu:
```javascript
{
  id: string,
  name: string,
  price: number,
  image: string (URL),
  images: string[] (4 URLs pro galerii),
  description: string,
  specifications: [{ label: string, value: string }],
  features: string[]
}
```

### 4. **Obrázky produktů**
Aktuálně: Placeholder obrázky z Unsplash
Potřeba: Nahrát skutečné fotografie produktů

Doporučení:
- Hlavní obrázek: 800x800px
- Galerie obrázky: 800x800px (4 ks na produkt)
- Category tiles: 600x400px
- Format: JPG nebo WebP
- Optimalizovat pro web

### 5. **Google OAuth integrace**
Soubory: `frontend/src/pages/LoginPage.jsx`, `frontend/src/pages/RegisterPage.jsx`

Aktuálně: Placeholder `alert()`
Potřeba: Implementovat Google OAuth 2.0

```javascript
// Přidat Google OAuth Client ID
// Nainstalovat: npm install @react-oauth/google
// Wrap App v GoogleOAuthProvider
```

### 6. **Platební brána**
Soubor: `frontend/src/pages/CheckoutPage.jsx`

Aktuálně: Simulované odeslání objednávky
Potřeba: Integrovat platební bránu (Stripe, GoPay, ComGate, atd.)

### 7. **Email notifikace**
Potřeba: Backend endpoint pro odesílání emailů
- Potvrzení objednávky zákazníkovi
- Notifikace pro administrátora

### 8. **Admin panel**
Potřeba: Vytvořit admin rozhraní pro:
- Správu produktů (CRUD)
- Správu objednávek
- Přehled zákazníků

### 9. **Environment variables**
Vytvořit `.env` soubory:

**Frontend** (`.env`)
```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Backend** (`.env`)
```
PORT=3001
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_PRODUCTS=Products
DYNAMODB_TABLE_ORDERS=Orders
STRIPE_SECRET_KEY=your_stripe_key
```

### 10. **SEO optimalizace**
Přidat do každé stránky:
- Meta tags (title, description)
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap.xml
- Robots.txt

---

## 🚀 Deployment na AWS

### Doporučená architektura:

1. **Frontend**: AWS Amplify nebo S3 + CloudFront
   - Build: `cd frontend && npm run build`
   - Deploy: Nahrát `dist/` folder

2. **Backend**: AWS Lambda + API Gateway nebo EC2
   - Nebo použít AWS Elastic Beanstalk

3. **Database**: DynamoDB
   - Vytvořit tabulky: Products, Orders, Users

4. **Storage**: S3 bucket pro obrázky produktů

### Deployment kroky:

```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Deploy backend
cd backend
npm install
# Deploy na Lambda nebo EC2

# 3. Nastavit AWS služby
- DynamoDB tabulky
- S3 bucket pro obrázky
- CloudFront distribuce
- Route 53 pro doménu
```

---

## 📋 Checklist před spuštěním

- [ ] Doplnit firemní údaje ve Footeru
- [ ] Připojit databázi (DynamoDB)
- [ ] Nahrát skutečné produkty
- [ ] Nahrát fotografie produktů
- [ ] Implementovat Google OAuth
- [ ] Integrovat platební bránu
- [ ] Nastavit email notifikace
- [ ] Vytvořit admin panel
- [ ] Nastavit environment variables
- [ ] Přidat SEO meta tags
- [ ] Otestovat na všech zařízeních
- [ ] Nastavit Google Analytics
- [ ] Připravit cookies banner (GDPR)
- [ ] Napsat obchodní podmínky
- [ ] Napsat zásady ochrany osobních údajů
- [ ] Nakonfigurovat AWS služby
- [ ] Nastavit vlastní doménu
- [ ] SSL certifikát (HTTPS)
- [ ] Backup strategie

---

## 🎨 Design Features

- Minimalistický černobílošedý design
- Čistý produktový katalog
- Elegantní category tiles
- Smooth animace a transitions
- Skeleton loading states
- Hover efekty všude
- Responzivní na všech zařízeních
- Rychlý a výkonný

---

## 💡 Poznámky

- Všechny animace jsou v `frontend/src/index.css`
- API endpoint je v `frontend/src/services/api.js`
- Cart context je v `frontend/src/context/CartContext.jsx`
- Design je inspirován Bimmer Euro (minimalistický, produktově orientovaný)

---

**Web je připraven na produkci po doplnění výše uvedených bodů!** ✅

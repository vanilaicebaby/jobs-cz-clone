# API Key Setup Guide

Jednoduchý návod pro zabezpečení API pomocí API Key v AWS API Gateway.

## 🔐 Proč API Key?

API Key poskytuje základní zabezpečení vašeho API:
- Omezuje přístup jen na autorizované klienty
- Umožňuje sledování usage
- Chrání před neoprávněným používáním
- Umožňuje rate limiting

## 📋 Setup v AWS Console

### Krok 1: Vytvoření API Key

1. Otevři [API Gateway Console](https://console.aws.amazon.com/apigateway)
2. V levém menu klikni na **"API Keys"**
3. Klikni **"Create API key"**
4. Vyplň:
   - **Name**: `carbon-parts-api-key`
   - **Description**: `API key for Carbon Parts frontend`
   - **Auto Generate**: Zaškrtni (nebo zadej vlastní klíč)
5. Klikni **"Save"**
6. **DŮLEŽITÉ**: Zkopíruj si API Key - už se nezobrazí!

###  Krok 2: Vytvoření Usage Plan

1. V levém menu klikni na **"Usage Plans"**
2. Klikni **"Create"**
3. Vyplň:
   - **Name**: `carbon-parts-plan`
   - **Description**: `Usage plan for Carbon Parts`
   - **Enable throttling**: (volitelné)
     - Rate: `1000` requests per second
     - Burst: `2000` requests
   - **Enable quota**: (volitelné)
     - `100000` requests per month
4. Klikni **"Next"**

### Krok 3: Přidání API Stage

1. Klikni **"Add API Stage"**
2. Vyber:
   - **API**: `prod-workuj-backend` (tvoje REST API)
   - **Stage**: `prod`
3. Klikni **"✓"** (checkmark)
4. Klikni **"Next"**

### Krok 4: Přidání API Key k Usage Plan

1. Klikni **"Add API Key to Usage Plan"**
2. Vyber tvůj API Key: `carbon-parts-api-key`
3. Klikni **"✓"** (checkmark)
4. Klikni **"Done"**

### Krok 5: Povolení API Key na Metodách

1. Vrať se do **APIs** → Vyber `prod-workuj-backend`
2. Pro každou metodu (`GET /api/products`, `GET /api/products/{id}`, atd.):
   - Klikni na metodu
   - Klikni **"Method Request"**
   - Najdi **"API Key Required"**
   - Změň na **`true`**
   - Klikni ✓ (checkmark)
3. Klikni **"Actions"** → **"Deploy API"**
4. Vyber stage **"prod"**
5. Klikni **"Deploy"**

## 🚀 Konfigurace Frontendu

### Option 1: Přes Environment Variable (Doporučeno)

1. Přidej GitHub Secret:
   - Name: `VITE_API_KEY`
   - Value: `tvůj-api-key-zde`

2. Frontend automaticky použije API key v requests

### Option 2: Hardcoded (Pro testing)

Upravfrontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'tvůj-api-key-zde', // POZOR: Nezapisuj do production!
  },
});
```

### Option 3: .env soubor (Development)

`frontend/.env.local`:
```
VITE_API_KEY=tvůj-api-key-zde
```

`frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY && {
      'x-api-key': import.meta.env.VITE_API_KEY
    }),
  },
});
```

## ✅ Testování

### Test bez API Key (mělo by selhat):

```bash
curl https://ldw0ca0cx6.execute-api.eu-central-1.amazonaws.com/prod/api/products
```

**Očekávaná odpověď:**
```json
{"message":"Forbidden"}
```

### Test s API Key (mělo by fungovat):

```bash
curl -H "x-api-key: tvůj-api-key-zde" \
  https://ldw0ca0cx6.execute-api.eu-central-1.amazonaws.com/prod/api/products
```

**Očekávaná odpověď:**
```json
[{"id":"1","name":"Karbonový Difuzor..."}]
```

## 📊 Monitoring Usage

1. Jdi na **API Gateway Console** → **Usage Plans**
2. Vyber svůj plan
3. Klikni na **API Keys** tab
4. Uvidíš statistiky usage pro každý klíč:
   - Number of requests
   - Data transferred
   - Errors

## 🔄 Rotace API Keys

### Kdy rotovat:
- Každých 90 dní (best practice)
- Při podezření na kompromitaci
- Při odchodu zaměstnance s přístupem

### Jak rotovat:

1. **Vytvoř nový API Key** (Krok 1 výše)
2. **Přidej k Usage Plan** (Krok 4 výše)
3. **Update frontend** s novým klíčem
4. **Deploy frontend**
5. **Počkej 24-48 hodin** (starý klíč stále funguje)
6. **Smaž starý API Key**:
   - API Gateway → API Keys
   - Vyber starý klíč → Actions → Delete

## 🛡️ Bezpečnostní Best Practices

### ✅ Doporučené:
- Používej environment variables pro API klíče
- Rotuj klíče pravidelně
- Nastav rate limiting v Usage Plan
- Monitoruj usage statistiky
- Používej HTTPS (API Gateway to vynucuje)

### ❌ NIKDY:
- Nezapisuj API key přímo do kódu
- Necommituj API key do gitu
- Nesdílej API key veřejně
- Nepoužívej stejný klíč pro dev a production

## 🔧 Troubleshooting

### Problem: "Forbidden" i s API Key

**Řešení:**
1. Zkontroluj, že API Key je správně zkopírovaný (bez mezer)
2. Ověř, že Usage Plan je associated s `prod` stage
3. Zkontroluj, že metody mají "API Key Required: true"
4. Ověř, že jsi deployoval API po změnách

### Problem: Headers nejsou poslány

**Řešení:**
1. Zkontroluj CORS nastavení v API Gateway
2. Ověř, že `x-api-key` je v allowed headers
3. Zkontroluj browser console pro CORS errors

### Problem: Rate limit překročen

**Řešení:**
1. Zkontroluj Usage Plan limity
2. Zvýš throttling/quota limity
3. Implementuj caching na frontendu
4. Optimalizuj počet API calls

## 📚 Alternativy

Pokud potřebuješ pokročilejší zabezpečení:

### 1. AWS Cognito
- User authentication
- JWT tokens
- User pools
- Složitější setup

### 2. Lambda Authorizer
- Custom authorization logic
- JWT validation
- OAuth/OIDC support
- Maximum flexibility

### 3. IAM Authorization
- AWS IAM credentials
- Nejvyšší bezpečnost
- Pro B2B integrace

---

**Vytvořeno**: 2025-11-05
**Verze**: 1.0.0

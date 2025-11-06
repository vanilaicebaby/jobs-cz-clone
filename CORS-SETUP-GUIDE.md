# CORS Setup Guide pro API Gateway

## ✅ Současná konfigurace

API Gateway má nyní **jednoduchý setup**:
- `{proxy+}` resource pod `/api` catchuje VŠECHNY requesty
- OPTIONS Mock integration vrací CORS headers
- Lambda vrací CORS headers pro všechny ostatní HTTP metody

## 🚀 Když přidáváš nové API endpointy

### ✨ NENÍ třeba dělat NIC speciálního!

Prostě přidej route do `backend/lambda.js`:

```javascript
app.post('/new-endpoint', async (req, res) => {
  // Lambda už má CORS middleware, který automaticky přidává headers
  res.json({ success: true });
});
```

**To je vše!** CORS funguje automaticky protože:
1. `{proxy+}` resource má OPTIONS Mock s CORS
2. Lambda má CORS middleware na všech routes

## 🔧 Když CORS nefunguje po deploym enteritu

### Problém: CloudFront cache

CloudFront může mít cached staré odpovědi bez CORS headers.

### Řešení 1: Počkat (doporučeno)
Počkej 5-10 minut, CloudFront cache vyprší.

### Řešení 2: Invalidovat cache

```bash
# Najdi CloudFront distribution ID
aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[0]=='workuj.cz'].Id" --output text

# Invaliduj cache
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## 📝 Struktura API Gateway

```
/                              (root)
└── /api                       (base path)
    └── /{proxy+}             (catches all: /api/*)
        ├── OPTIONS           → Mock integration s CORS headers
        └── ANY               → Lambda AWS_PROXY integration
```

### Proč {proxy+}?

- **Jednoduché**: Jedno místo pro CORS config
- **Flexibilní**: Nové routes v Lambda fungují okamžitě
- **Standardní**: AWS best practice pro REST APIs

## 🐛 Debugging CORS

### Test OPTIONS preflight (bez cache):
```bash
curl -v -X OPTIONS \
  -H "Origin: https://workuj.cz" \
  -H "Access-Control-Request-Method: POST" \
  https://ldw0ca0cx6.execute-api.eu-central-1.amazonaws.com/prod/api/YOUR_ENDPOINT
```

Mělo by vrátit:
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://workuj.cz
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key
```

### Test GET/POST request:
```bash
curl -v \
  -H "x-api-key: <API_KEY>" \
  https://ldw0ca0cx6.execute-api.eu-central-1.amazonaws.com/prod/api/YOUR_ENDPOINT
```

Mělo by vrátit CORS headers z Lambda:
```
Access-Control-Allow-Origin: https://workuj.cz
Access-Control-Allow-Credentials: true
```

## ⚠️ POZOR: Nedělej tyto věci!

❌ **Nevytvářej explicitní resources v API Gateway**
  - Nepoužívej: `/api/products`, `/api/auth/register`, atd.
  - Používej: Pouze `{proxy+}` resource

❌ **Neměň OPTIONS Mock integration**
  - Je správně nastavená pro všechny endpointy

❌ **Nemazat CORS middleware z Lambda**
  - Je v `backend/lambda.js` řádky 32-45
  - Potřebný pro GET/POST/PUT/DELETE responses

## ✅ Checklist před deployem

- [ ] Nový endpoint přidán do `backend/lambda.js`
- [ ] Lambda má CORS middleware (už tam je)
- [ ] `{proxy+}` resource existuje (už tam je)
- [ ] Po deployi počkat 5-10 min na CloudFront cache invalidaci
- [ ] Nebo manuálně invalidovat CloudFront cache

## 📚 Další zdroje

- [AWS API Gateway Proxy Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html)
- [CORS on API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html)

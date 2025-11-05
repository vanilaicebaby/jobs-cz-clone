# DynamoDB Setup & Data Import

Návod jak naimportovat produkty do DynamoDB a propojit s Lambda API.

## 🗄️ Krok 1: Vytvoření DynamoDB Tabulky

### Přes AWS Console

1. Otevři [AWS DynamoDB Console](https://console.aws.amazon.com/dynamodb)
2. Klikni na **"Create table"**
3. Nastav:
   - **Table name**: `carbon-parts-products`
   - **Partition key**: `id` (String)
   - **Table settings**: Default settings
4. Klikni **"Create table"**

### Přes AWS CLI

```bash
aws dynamodb create-table \
  --table-name carbon-parts-products \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1
```

## 📦 Krok 2: Import Produktů do DynamoDB

### Možnost A: Pomocí Import Scriptu (Doporučeno)

```bash
# Nainstaluj dependencies
cd backend
npm install

# Nastav environment proměnné
export AWS_REGION=eu-central-1
export DYNAMODB_TABLE_NAME=carbon-parts-products

# Spusť import
node import-to-dynamodb.js
```

**Výstup:**
```
🚀 Importuji 8 produktů do DynamoDB tabulky: carbon-parts-products
📍 Region: eu-central-1

✅ Importován produkt: 1 - Karbonový Difuzor Vzor CSL pro BMW M4 G82
✅ Importován produkt: 2 - Karbonová Kapota pro BMW M3 F80
...

📊 Import dokončen:
   ✅ Úspěšně: 8
   ❌ Chyby: 0
   📦 Celkem: 8
```

### Možnost B: Ruční Import přes AWS Console

1. Otevři tabulku `carbon-parts-products`
2. Klikni **"Explore table items"** → **"Create item"**
3. Zkopíruj data z `backend/products.json`
4. Pro každý produkt vytvoř nový item

### Možnost C: AWS CLI Batch Write

```bash
# Použij AWS CLI s JSON souborem
aws dynamodb batch-write-item \
  --request-items file://dynamodb-batch-import.json \
  --region eu-central-1
```

## 🔐 Krok 3: Lambda Permissions

Lambda funkce potřebuje oprávnění číst z DynamoDB.

### Přidat IAM Policy k Lambda Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:eu-central-1:*:table/carbon-parts-products"
    }
  ]
}
```

### Přes AWS Console

1. Otevři [Lambda Console](https://console.aws.amazon.com/lambda)
2. Vyber tvou Lambda funkci
3. Jdi na **Configuration** → **Permissions**
4. Klikni na **Role name**
5. V IAM Console klikni **Add permissions** → **Attach policies**
6. Vytvoř novou policy s JSON výše nebo použij `AmazonDynamoDBReadOnlyAccess`

### Přes AWS CLI

```bash
# Zjisti ARN role Lambda funkce
aws lambda get-function --function-name carbon-parts-backend --query 'Configuration.Role'

# Přidej inline policy
aws iam put-role-policy \
  --role-name YourLambdaRoleName \
  --policy-name DynamoDBReadAccess \
  --policy-document file://dynamodb-policy.json
```

## ⚙️ Krok 4: Lambda Environment Variables

Nastav v Lambda funkci environment variables:

### Přes AWS Console

1. Lambda funkce → **Configuration** → **Environment variables**
2. Přidej:
   - **Key**: `DYNAMODB_TABLE_NAME`, **Value**: `carbon-parts-products`
   - **Key**: `AWS_REGION`, **Value**: `eu-central-1`

### Přes AWS CLI

```bash
aws lambda update-function-configuration \
  --function-name carbon-parts-backend \
  --environment Variables="{DYNAMODB_TABLE_NAME=carbon-parts-products,AWS_REGION=eu-central-1}" \
  --region eu-central-1
```

## 🚀 Krok 5: Deploy Nové Verze Backendu

```bash
# Commitni změny
git add .
git commit -m "Add DynamoDB integration to backend"
git push origin master
```

GitHub Actions automaticky nasadí novou verzi s DynamoDB integrací.

## ✅ Krok 6: Testování

### Test API Endpointu

```bash
# Získat všechny produkty
curl https://YOUR-API-URL/api/products

# Získat jeden produkt
curl https://YOUR-API-URL/api/products/1
```

### Očekávaný Response

```json
[
  {
    "id": "1",
    "name": "Karbonový Difuzor Vzor CSL pro BMW M4 G82",
    "category": "BMW M4 G82 | Exteriér",
    "price": 45900,
    ...
  }
]
```

## 🔍 Troubleshooting

### Error: "Unable to access DynamoDB"

**Příčina**: Lambda nemá permissions
**Řešení**: Zkontroluj IAM role a permissions (Krok 3)

### Error: "Table not found"

**Příčina**: Nesprávný název tabulky nebo region
**Řešení**: Zkontroluj environment variables v Lambda

### Error: "No items returned"

**Příčina**: Data nebyla naimportována
**Řešení**: Spusť znovu import script (Krok 2)

### Produkty se nezobrazují na frontendu

1. Zkontroluj API URL v GitHub Secrets (`VITE_API_URL`)
2. Zkontroluj CORS v Lambda
3. Zkontroluj CloudWatch logs:
```bash
aws logs tail /aws/lambda/carbon-parts-backend --follow
```

## 📊 Struktura DynamoDB Tabulky

**Table Name**: `carbon-parts-products`

**Primary Key**: `id` (String)

**Attributes**:
- `id` - String (Primary Key)
- `name` - String
- `category` - String
- `price` - Number
- `image` - String
- `images` - List
- `isNew` - Boolean
- `description` - String
- `specifications` - List
- `features` - List

## 💰 Náklady

DynamoDB Pay-Per-Request pricing pro malou aplikaci:

- **Free Tier**: 25 GB storage, 25 WCU, 25 RCU
- **Estimated**: ~$0-2/měsíc pro 10,000 requests

## 🔄 Další Kroky

### Přidat Query by Category

Vytvoř Global Secondary Index (GSI):

```bash
aws dynamodb update-table \
  --table-name carbon-parts-products \
  --attribute-definitions AttributeName=category,AttributeType=S \
  --global-secondary-index-updates '[{
    "Create": {
      "IndexName": "category-index",
      "KeySchema": [{"AttributeName":"category","KeyType":"HASH"}],
      "Projection": {"ProjectionType":"ALL"}
    }
  }]'
```

Pak v Lambda:

```javascript
app.get('/api/products/category/:category', async (req, res) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    IndexName: 'category-index',
    KeyConditionExpression: 'category = :category',
    ExpressionAttributeValues: {
      ':category': req.params.category
    }
  });

  const response = await docClient.send(command);
  res.json(response.Items || []);
});
```

---

**Vytvořeno**: 2025-11-05
**Verze**: 1.0.0

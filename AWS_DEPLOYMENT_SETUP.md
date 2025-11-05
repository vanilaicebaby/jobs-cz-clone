# AWS Deployment Setup Guide

Kompletní návod pro nasazení BMW Carbon Shop na AWS infrastrukturu.

## 📋 Přehled Architektury

- **Backend**: AWS Lambda (Node.js 18.x) s API Gateway nebo Function URL
- **Frontend**: S3 + CloudFront CDN
- **Deployment**: GitHub Actions automatické nasazení při push do `master`

## 🚀 Krok za Krokem Setup

### 1. AWS Lambda Setup (Backend)

#### Vytvoření Lambda Funkce

```bash
# Přes AWS Console nebo AWS CLI:
aws lambda create-function \
  --function-name bmw-carbon-backend-prod \
  --runtime nodejs18.x \
  --handler lambda.handler \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --region eu-central-1 \
  --timeout 30 \
  --memory-size 512
```

#### Konfigurace Lambda Function URL (Doporučeno - jednodušší než API Gateway)

```bash
# Vytvořit Function URL
aws lambda create-function-url-config \
  --function-name bmw-carbon-backend-prod \
  --auth-type NONE \
  --cors '{
    "AllowOrigins": ["*"],
    "AllowMethods": ["GET", "POST", "PUT", "DELETE"],
    "AllowHeaders": ["Content-Type", "Authorization"],
    "MaxAge": 86400
  }'

# Přidat permission pro public přístup
aws lambda add-permission \
  --function-name bmw-carbon-backend-prod \
  --statement-id FunctionURLAllowPublicAccess \
  --action lambda:InvokeFunctionUrl \
  --principal "*" \
  --function-url-auth-type NONE
```

**Output bude obsahovat Function URL** ve formátu:
```
https://abc123xyz.lambda-url.eu-central-1.on.aws
```

**DŮLEŽITÉ**: Uložte si tuto URL - budete ji potřebovat pro frontend!

#### Alternativa: API Gateway (pokud chcete custom doménu)

1. Vytvořte HTTP API v API Gateway
2. Přidejte integraci s Lambda funkcí
3. Nakonfigurujte CORS
4. Získejte API endpoint URL

### 2. S3 + CloudFront Setup (Frontend)

#### Vytvoření S3 Bucketu

```bash
# Vytvořit bucket
aws s3 mb s3://bmw-carbon-shop-frontend --region eu-central-1

# Nastavit jako static website hosting
aws s3 website s3://bmw-carbon-shop-frontend \
  --index-document index.html \
  --error-document index.html
```

#### Bucket Policy (pro CloudFront přístup)

Vytvořte bucket policy (`bucket-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipal",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bmw-carbon-shop-frontend/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
      }
    }
  ]
}
```

Aplikovat policy:
```bash
aws s3api put-bucket-policy \
  --bucket bmw-carbon-shop-frontend \
  --policy file://bucket-policy.json
```

#### Vytvoření CloudFront Distribution

1. Přejděte do AWS Console → CloudFront
2. Create Distribution
3. **Origin Settings**:
   - Origin Domain: Vyberte S3 bucket
   - Origin Access: Origin Access Control (OAC) - vytvořte nový
   - Enable Origin Shield: Ne (pro cost savings)

4. **Default Cache Behavior**:
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Allowed HTTP Methods: GET, HEAD, OPTIONS
   - Cache Policy: CachingOptimized
   - Origin Request Policy: CORS-S3Origin

5. **Distribution Settings**:
   - Price Class: Use Only Europe and North America
   - Default Root Object: `index.html`
   - Custom Error Pages:
     - 404 → /index.html (200) - pro SPA routing
     - 403 → /index.html (200) - pro SPA routing

6. **Create Distribution** a počkejte na deployment (~10-15 minut)

7. Získejte CloudFront Distribution ID a URL

### 3. GitHub Secrets Setup

V GitHub repository → Settings → Secrets and variables → Actions přidejte:

#### Povinné Secrets

| Secret Name | Popis | Příklad |
|------------|-------|---------|
| `AWS_ACCESS_KEY_ID` | AWS přístupový klíč | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS tajný klíč | `wJal...` |
| `AWS_REGION` | AWS region | `eu-central-1` |
| `LAMBDA_FUNCTION_NAME` | Název Lambda funkce | `bmw-carbon-backend-prod` |
| `S3_BUCKET_NAME` | Název S3 bucketu | `bmw-carbon-shop-frontend` |
| `VITE_API_URL` | Backend API URL | `https://abc123.lambda-url.eu-central-1.on.aws` |

#### Volitelné Secrets

| Secret Name | Popis | Příklad |
|------------|-------|---------|
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront ID | `E1234ABCD5678` |

### 4. IAM User/Role pro GitHub Actions

Vytvořte IAM usera s těmito oprávněními:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "LambdaDeployment",
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration"
      ],
      "Resource": "arn:aws:lambda:eu-central-1:*:function:bmw-carbon-backend-prod"
    },
    {
      "Sid": "S3Deployment",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bmw-carbon-shop-frontend",
        "arn:aws:s3:::bmw-carbon-shop-frontend/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::*:distribution/*"
    }
  ]
}
```

### 5. První Deployment

#### Lokální test buildu

```bash
# Backend - install dependencies
cd backend
npm install

# Frontend - build test
cd ../frontend
npm install
npm run build
```

#### Spuštění GitHub Actions

```bash
# Commit a push do master větve
git add .
git commit -m "Setup AWS deployment"
git push origin master
```

GitHub Actions automaticky:
1. ✅ Nainstaluje závislosti
2. ✅ Zabalí backend do ZIP
3. ✅ Nasadí na Lambda
4. ✅ Buildne frontend
5. ✅ Nahraje do S3
6. ✅ Invaliduje CloudFront cache

### 6. Ověření Deploymentu

#### Test Backendu

```bash
# Health check
curl https://YOUR-LAMBDA-URL.lambda-url.eu-central-1.on.aws/api/health

# Products API
curl https://YOUR-LAMBDA-URL.lambda-url.eu-central-1.on.aws/api/products
```

#### Test Frontendu

Otevřete v prohlížeči:
```
https://YOUR-DISTRIBUTION-ID.cloudfront.net
```

## 🔧 Troubleshooting

### Lambda Issues

**Problem**: Lambda timeout
```bash
# Zvýšit timeout na 30 sekund
aws lambda update-function-configuration \
  --function-name bmw-carbon-backend-prod \
  --timeout 30
```

**Problem**: CORS errors
- Zkontrolujte CORS nastavení ve Function URL nebo API Gateway
- Lambda handler již má CORS middleware v kódu

### S3/CloudFront Issues

**Problem**: 403 Forbidden
- Zkontrolujte bucket policy
- Ověřte CloudFront OAC nastavení

**Problem**: Staré soubory se zobrazují
- Počkejte na CloudFront invalidation (~2-5 minut)
- Vynuťte refresh: Ctrl + Shift + R

**Problem**: SPA routing nefunguje (404 na /product/1)
- Zkontrolujte Custom Error Responses v CloudFront
- 404 a 403 musí redirectovat na `/index.html` s 200

## 📊 Monitoring & Costs

### CloudWatch Logs

```bash
# Lambda logs
aws logs tail /aws/lambda/bmw-carbon-backend-prod --follow

# Filtrovat errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/bmw-carbon-backend-prod \
  --filter-pattern "ERROR"
```

### Estimované Měsíční Náklady

Pro malý až střední traffic (~10,000 požadavků/měsíc):

- **Lambda**: ~$0-5 (1M requests free tier)
- **S3**: ~$0.50
- **CloudFront**: ~$1-5 (50GB transfer free tier)
- **Data Transfer**: ~$1-3

**Celkem: ~$2-15/měsíc** (závisí na trafficu)

## 🔐 Bezpečnost

### Doporučení

1. ✅ Používejte HTTPS (CloudFront to vynucuje)
2. ✅ Nastavte rate limiting na API Gateway (pokud používáte)
3. ✅ Rotujte AWS credentials pravidelně
4. ✅ Používejte AWS Secrets Manager pro citlivá data
5. ✅ Povolte CloudFront logging
6. ✅ Nastavte CloudWatch alarmy

## 📚 Další Kroky

### Custom Domain (Volitelné)

1. Zaregistrujte doménu v Route 53
2. Vytvořte SSL certifikát v ACM (us-east-1 pro CloudFront!)
3. Přidejte alternate domain name do CloudFront
4. Vytvořte A record v Route 53 → CloudFront

### Databáze (Budoucnost)

Pro persistent data zvažte:
- DynamoDB (serverless)
- RDS Aurora Serverless
- MongoDB Atlas

### CI/CD Vylepšení

- Přidat staging environment
- Automatické testy před deploymentem
- Blue-green deployment
- Rollback strategie

## 📞 Support

Pokud narazíte na problémy:
1. Zkontrolujte GitHub Actions logs
2. Zkontrolujte CloudWatch logs
3. Ověřte všechny GitHub Secrets
4. Zkontrolujte IAM permissions

---

**Vytvořeno**: 2025-11-05
**Verze**: 1.0.0

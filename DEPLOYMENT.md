# AWS Deployment Guide

Komplétní návod na nasazení BMW Carbon E-shop do AWS infrastruktury.

## 🏗️ Architektura

### Doporučená AWS Architektura

```
┌─────────────────────────────────────────────────┐
│                   CloudFront                     │
│              (CDN + SSL Certificate)             │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼──────┐  ┌─────▼──────────┐
│   S3 Bucket  │  │   API Gateway  │
│   (Frontend) │  │                │
└──────────────┘  └────────┬───────┘
                           │
                  ┌────────▼─────────┐
                  │  Lambda Function │
                  │    (Backend)     │
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │    DynamoDB      │
                  │   (Database)     │
                  └──────────────────┘
```

## 📦 Option 1: AWS Amplify (Nejjednodušší)

### Krok 1: Příprava
```bash
# Instalace Amplify CLI
npm install -g @aws-amplify/cli

# Konfigurace AWS credentials
amplify configure
```

### Krok 2: Inicializace Projektu
```bash
cd carshop
amplify init

# Odpovězte na otázky:
# - Environment: production
# - Default editor: Visual Studio Code
# - App type: javascript
# - Framework: react
# - Source Directory: frontend/src
# - Distribution Directory: frontend/dist
# - Build Command: npm run build
# - Start Command: npm run dev
```

### Krok 3: Přidání Hostingu
```bash
# Pro frontend
amplify add hosting

# Vyberte:
# - Amazon CloudFront and S3
```

### Krok 4: Přidání API a Database
```bash
# Přidání REST API
amplify add api

# Vyberte:
# - REST
# - Create a new Lambda function
# - Serverless ExpressJS function

# Přidání DynamoDB
amplify add storage

# Vyberte:
# - NoSQL Database
```

### Krok 5: Deploy
```bash
# Deploy všeho najednou
amplify push

# Publish frontend
amplify publish
```

## 📦 Option 2: Manuální AWS Setup (Větší kontrola)

### 1. Frontend Deployment (S3 + CloudFront)

#### 1.1 Build Frontend
```bash
cd frontend
npm run build
```

#### 1.2 Vytvoření S3 Bucket
```bash
aws s3 mb s3://bmw-carbon-shop-frontend

# Konfigurace pro static website hosting
aws s3 website s3://bmw-carbon-shop-frontend \
  --index-document index.html \
  --error-document index.html
```

#### 1.3 Upload do S3
```bash
aws s3 sync dist/ s3://bmw-carbon-shop-frontend --delete

# Nastavení public read
aws s3api put-bucket-policy \
  --bucket bmw-carbon-shop-frontend \
  --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bmw-carbon-shop-frontend/*"
    }
  ]
}
```

#### 1.4 CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name bmw-carbon-shop-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### 2. Backend Deployment (Lambda + API Gateway)

#### 2.1 Příprava Lambda Package
```bash
cd backend
npm install --production

# Vytvoření ZIP
zip -r function.zip .
```

#### 2.2 Vytvoření Lambda Function
```bash
# Vytvoření IAM role pro Lambda
aws iam create-role \
  --role-name lambda-bmw-carbon-role \
  --assume-role-policy-document file://trust-policy.json

# Vytvoření Lambda funkce
aws lambda create-function \
  --function-name bmw-carbon-api \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-bmw-carbon-role \
  --handler server.handler \
  --zip-file fileb://function.zip
```

#### 2.3 API Gateway Setup
```bash
# Vytvoření REST API
aws apigateway create-rest-api \
  --name bmw-carbon-api \
  --endpoint-configuration types=REGIONAL

# Vytvoření resources a methods
# ... (detailní kroky v AWS Console)
```

### 3. DynamoDB Setup

#### 3.1 Vytvoření Products Table
```bash
aws dynamodb create-table \
  --table-name bmw-carbon-products \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=category,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"category-index\",\"KeySchema\":[{\"AttributeName\":\"category\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1
```

#### 3.2 Import Mock Data
Vytvořte `import-data.js`:
```javascript
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import mockProducts from './mockProducts.js';

const client = new DynamoDBClient({ region: 'eu-central-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function importProducts() {
  for (const product of mockProducts) {
    await docClient.send(
      new PutCommand({
        TableName: 'bmw-carbon-products',
        Item: product,
      })
    );
  }
  console.log('Import complete!');
}

importProducts();
```

Spusťte:
```bash
node import-data.js
```

### 4. Environment Variables

#### Lambda Environment Variables
```bash
aws lambda update-function-configuration \
  --function-name bmw-carbon-api \
  --environment "Variables={
    DYNAMODB_TABLE=bmw-carbon-products,
    AWS_REGION=eu-central-1
  }"
```

## 📦 Option 3: Docker + ECS (Pro větší aplikace)

### 1. Vytvoření Dockerfile

**backend/Dockerfile:**
```dockerfile
FROM node:21-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

### 2. Build a Push do ECR
```bash
# Vytvoření ECR repository
aws ecr create-repository --repository-name bmw-carbon-backend

# Build Docker image
docker build -t bmw-carbon-backend backend/

# Tag a push
docker tag bmw-carbon-backend:latest YOUR_ACCOUNT.dkr.ecr.eu-central-1.amazonaws.com/bmw-carbon-backend:latest
docker push YOUR_ACCOUNT.dkr.ecr.eu-central-1.amazonaws.com/bmw-carbon-backend:latest
```

### 3. ECS Setup
```bash
# Vytvoření ECS cluster
aws ecs create-cluster --cluster-name bmw-carbon-cluster

# Vytvoření task definition
# Vytvoření ECS service
# ... (detailní kroky v AWS Console)
```

## 🔒 Security Best Practices

### 1. SSL Certificate (CloudFront)
```bash
# Požádat o certifikát v ACM
aws acm request-certificate \
  --domain-name bmwcarbon.cz \
  --validation-method DNS
```

### 2. WAF Rules
- Rate limiting
- SQL injection protection
- XSS protection

### 3. IAM Policies
- Principle of least privilege
- Separate roles pro různé služby

## 💰 Odhadované Náklady (měsíčně)

### Small Scale (< 1000 návštěv/měsíc)
- **S3 + CloudFront**: ~$5
- **Lambda**: ~$2 (Free tier)
- **DynamoDB**: ~$3 (Free tier)
- **API Gateway**: ~$3
- **Total**: ~$10-15/měsíc

### Medium Scale (10000 návštěv/měsíc)
- **S3 + CloudFront**: ~$20
- **Lambda**: ~$10
- **DynamoDB**: ~$15
- **API Gateway**: ~$15
- **Total**: ~$60-70/měsíc

## 🚀 CI/CD Setup (GitHub Actions)

Vytvořte `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '21'

      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build
        working-directory: ./frontend
        run: npm run build

      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync frontend/dist/ s3://bmw-carbon-shop-frontend --delete
          aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '21'

      - name: Deploy Lambda
        working-directory: ./backend
        run: |
          npm ci --production
          zip -r function.zip .
          aws lambda update-function-code \
            --function-name bmw-carbon-api \
            --zip-file fileb://function.zip
```

## 📊 Monitoring

### CloudWatch Dashboards
- Lambda invocations
- API Gateway requests
- DynamoDB read/write units
- S3 bandwidth

### Alarms
```bash
# CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name high-lambda-errors \
  --alarm-description "Lambda error rate > 5%" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold
```

## 🔧 Maintenance

### Backup Strategy
```bash
# DynamoDB on-demand backup
aws dynamodb create-backup \
  --table-name bmw-carbon-products \
  --backup-name daily-backup-$(date +%Y%m%d)
```

### Log Retention
- CloudWatch Logs: 30 dní
- S3 Access Logs: 90 dní

---

**Tip**: Začněte s AWS Amplify (Option 1) pro rychlý start, později přejděte na manuální setup pro větší kontrolu.

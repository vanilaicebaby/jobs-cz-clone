#!/bin/bash

echo "=== 1. Zjištění všech API Gateway v účtu ==="
echo ""

echo "HTTP APIs (API Gateway v2):"
aws apigatewayv2 get-apis --region eu-central-1 --output table

echo ""
echo "REST APIs (API Gateway v1):"
aws apigateway get-rest-apis --region eu-central-1 --output table

echo ""
echo "=== 2. Detailní informace o HTTP APIs ==="
aws apigatewayv2 get-apis --region eu-central-1 --query 'Items[].{Name:Name,ApiId:ApiId,ApiEndpoint:ApiEndpoint,ProtocolType:ProtocolType}' --output table

echo ""
echo "=== 3. Detailní informace o REST APIs ==="
aws apigateway get-rest-apis --region eu-central-1 --query 'items[].{Name:name,Id:id,CreatedDate:createdDate}' --output table

echo ""
echo "=== 4. Zjištění Lambda funkce ==="
aws lambda list-functions --region eu-central-1 --query 'Functions[].{Name:FunctionName,Runtime:Runtime,LastModified:LastModified}' --output table

echo ""
echo "=== 5. Zkontrolovat, jestli Lambda má API Gateway trigger ==="
echo "Zadej název své Lambda funkce:"
read LAMBDA_NAME

if [ -n "$LAMBDA_NAME" ]; then
  echo ""
  echo "Lambda policy pro $LAMBDA_NAME:"
  aws lambda get-policy --function-name "$LAMBDA_NAME" --region eu-central-1 --query 'Policy' --output text | jq '.' 2>/dev/null || echo "Žádná policy nebo jq není nainstalován"
fi

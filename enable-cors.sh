#!/bin/bash
API_ID="ldw0ca0cx6"
REGION="eu-central-1"

# Update integration response for /api/products GET
aws apigateway update-integration-response \
  --rest-api-id $API_ID \
  --resource-id sxmrhv \
  --http-method GET \
  --status-code 200 \
  --patch-operations op=replace,path=/responseParameters/method.response.header.Access-Control-Allow-Origin,value="'*'" \
  --region $REGION --output json

# Deploy
aws apigateway create-deployment --rest-api-id $API_ID --stage-name prod --region $REGION --output json

echo "CORS updated!"

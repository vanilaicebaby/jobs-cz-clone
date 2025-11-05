#!/bin/bash

# API Gateway CORS setup script
API_ID="ldw0ca0cx6"
REGION="eu-central-1"

echo "Setting up CORS for API Gateway: $API_ID"

# List of resources that need CORS
declare -A RESOURCES=(
  ["sxmrhv"]="/api/products"
  ["xxjewm"]="/api/products/{id}"
  ["l77mr2"]="/api/health"
  ["sm0pridv17"]="/"
)

# Function to enable CORS on a resource
enable_cors() {
  local resource_id=$1
  local path=$2

  echo ""
  echo "=== Enabling CORS for: $path (resource: $resource_id) ==="

  # 1. Create OPTIONS method (if doesn't exist)
  echo "Creating OPTIONS method..."
  aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || echo "  OPTIONS method already exists"

  # 2. Create mock integration for OPTIONS
  echo "Creating mock integration for OPTIONS..."
  aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION > /dev/null

  # 3. Create method response for OPTIONS
  echo "Creating method response for OPTIONS..."
  aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters \
      method.response.header.Access-Control-Allow-Headers=false,\
method.response.header.Access-Control-Allow-Methods=false,\
method.response.header.Access-Control-Allow-Origin=false \
    --region $REGION > /dev/null

  # 4. Create integration response for OPTIONS with CORS headers
  echo "Creating integration response for OPTIONS..."
  aws apigateway put-integration-response \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method OPTIONS \
    --status-code 200 \
    --response-parameters \
      method.response.header.Access-Control-Allow-Headers="'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key'",\
method.response.header.Access-Control-Allow-Methods="'GET,POST,PUT,DELETE,OPTIONS'",\
method.response.header.Access-Control-Allow-Origin="'https://workuj.cz'" \
    --region $REGION > /dev/null

  # 5. Update GET method response to include CORS headers
  echo "Updating GET method response..."
  aws apigateway put-method-response \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method GET \
    --status-code 200 \
    --response-parameters \
      method.response.header.Access-Control-Allow-Origin=false \
    --region $REGION 2>/dev/null || echo "  GET method response already configured"

  # 6. Update GET integration response to include CORS headers
  echo "Updating GET integration response..."
  aws apigateway update-integration-response \
    --rest-api-id $API_ID \
    --resource-id $resource_id \
    --http-method GET \
    --status-code 200 \
    --patch-operations \
      op=add,path=/responseParameters/method.response.header.Access-Control-Allow-Origin,value="'https://workuj.cz'" \
    --region $REGION 2>/dev/null || echo "  GET integration response already configured"

  echo "✅ CORS enabled for $path"
}

# Enable CORS for all resources
for resource_id in "${!RESOURCES[@]}"; do
  enable_cors "$resource_id" "${RESOURCES[$resource_id]}"
done

# Deploy changes
echo ""
echo "=== Deploying changes to 'prod' stage ==="
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod \
  --region $REGION

echo ""
echo "🎉 CORS setup complete!"
echo "API URL: https://${API_ID}.execute-api.eu-central-1.amazonaws.com/prod"

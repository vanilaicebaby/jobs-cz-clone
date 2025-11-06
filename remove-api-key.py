import boto3

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'

client = boto3.client('apigateway', region_name=REGION)

print("=== Removing API Key requirement from API Gateway ===\n")

# Get {proxy+} resource
resources = client.get_resources(restApiId=API_ID)
proxy_resource = None

for r in resources['items']:
    if r.get('pathPart') == '{proxy+}':
        proxy_resource = r
        break

if not proxy_resource:
    print("[ERROR] {proxy+} resource not found")
    exit(1)

proxy_resource_id = proxy_resource['id']
print(f"Found {{proxy+}} resource: {proxy_resource_id}")

# Update ANY method to not require API key
print("\n1. Removing API key requirement from ANY method...")
try:
    client.update_method(
        restApiId=API_ID,
        resourceId=proxy_resource_id,
        httpMethod='ANY',
        patchOperations=[
            {
                'op': 'replace',
                'path': '/apiKeyRequired',
                'value': 'false'
            }
        ]
    )
    print("   [OK] API key requirement removed from ANY method")
except Exception as e:
    print(f"   [ERROR] Failed to update ANY method: {e}")

# Deploy changes
print("\n2. Deploying to prod stage...")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Remove API key requirement - use only JWT auth'
)
print(f"   [OK] Deployed! Deployment ID: {response['id']}")

print("\n" + "="*60)
print("[SUCCESS] API key requirement removed!")
print("\nPublic endpoints (no auth):")
print("  - GET  /api/products")
print("  - GET  /api/products/:id")
print("  - GET  /api/health")
print("  - POST /api/auth/register")
print("  - POST /api/auth/login")
print("\nProtected endpoints (JWT required):")
print("  - GET  /api/auth/profile")
print("  - PUT  /api/auth/profile")
print("  - POST /api/orders")
print("  - GET  /api/orders")
print("  - GET  /api/orders/:id")
print("="*60)

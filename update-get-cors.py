import boto3

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'
ALLOWED_ORIGIN = 'https://workuj.cz'

client = boto3.client('apigateway', region_name=REGION)

resources = {
    'sxmrhv': '/api/products',
    'xxjewm': '/api/products/{id}',
    'l77mr2': '/api/health',
}

def update_get_cors(resource_id, path):
    print(f"\n=== Updating GET CORS for {path} ===")

    try:
        # Try to delete existing integration response first
        print("1. Removing old integration response...")
        try:
            client.delete_integration_response(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='GET',
                statusCode='200'
            )
            print("   [OK] Old response deleted")
        except:
            print("   [OK] No old response to delete")

        # Create new integration response with CORS
        print("2. Creating new integration response with CORS...")
        client.put_integration_response(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='GET',
            statusCode='200',
            responseParameters={
                'method.response.header.Access-Control-Allow-Origin': f"'{ALLOWED_ORIGIN}'"
            }
        )
        print("   [OK] Integration response created with CORS header")

        print(f"[SUCCESS] CORS updated for GET {path}")

    except Exception as e:
        print(f"[ERROR] {path}: {e}")

# Update all resources
for resource_id, path in resources.items():
    update_get_cors(resource_id, path)

# Deploy
print("\n=== Deploying to prod ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Update GET CORS headers'
)
print(f"[OK] Deployed! ID: {response['id']}")
print(f"\n[SUCCESS] All done! Test at: https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod")

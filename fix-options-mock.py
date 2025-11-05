import boto3
import json

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'
ALLOWED_ORIGIN = 'https://workuj.cz'

client = boto3.client('apigateway', region_name=REGION)

resources = {
    'sxmrhv': '/api/products',
    'xxjewm': '/api/products/{id}',
    'l77mr2': '/api/health',
}

def fix_options_mock(resource_id, path):
    print(f"\n=== Fixing OPTIONS Mock for {path} ===")

    try:
        # 1. Delete existing OPTIONS method if it exists
        print("1. Cleaning up existing OPTIONS method...")
        try:
            client.delete_method(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='OPTIONS'
            )
            print("   [OK] Old OPTIONS method deleted")
        except:
            print("   [OK] No old OPTIONS method to delete")

        # 2. Create OPTIONS method
        print("2. Creating OPTIONS method...")
        client.put_method(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            authorizationType='NONE',
            apiKeyRequired=False
        )
        print("   [OK] OPTIONS method created")

        # 3. Create Mock integration with proper request template
        print("3. Creating Mock integration...")
        client.put_integration(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            type='MOCK',
            requestTemplates={
                'application/json': '{"statusCode": 200}'
            }
        )
        print("   [OK] Mock integration created")

        # 4. Create method response
        print("4. Creating method response...")
        client.put_method_response(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            statusCode='200',
            responseParameters={
                'method.response.header.Access-Control-Allow-Headers': False,
                'method.response.header.Access-Control-Allow-Methods': False,
                'method.response.header.Access-Control-Allow-Origin': False
            },
            responseModels={
                'application/json': 'Empty'
            }
        )
        print("   [OK] Method response created")

        # 5. Create integration response with CORS headers
        print("5. Creating integration response with CORS headers...")
        client.put_integration_response(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            statusCode='200',
            responseParameters={
                'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key'",
                'method.response.header.Access-Control-Allow-Methods': "'GET,POST,PUT,DELETE,OPTIONS'",
                'method.response.header.Access-Control-Allow-Origin': f"'{ALLOWED_ORIGIN}'"
            },
            responseTemplates={
                'application/json': ''
            }
        )
        print("   [OK] Integration response created")

        print(f"[SUCCESS] OPTIONS Mock fixed for {path}")

    except Exception as e:
        print(f"[ERROR] Failed to fix {path}: {e}")
        import traceback
        traceback.print_exc()

# Fix all resources
for resource_id, path in resources.items():
    fix_options_mock(resource_id, path)

# Deploy
print("\n=== Deploying to prod ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Fix OPTIONS Mock integration'
)
print(f"[OK] Deployed! Deployment ID: {response['id']}")
print(f"\n[SUCCESS] OPTIONS Mock fixed and deployed!")
print(f"Test with: curl -X OPTIONS -I https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod/api/products")

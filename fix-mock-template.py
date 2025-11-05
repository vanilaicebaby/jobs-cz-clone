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

def fix_integration_response(resource_id, path):
    print(f"\n=== Fixing integration response for {path} ===")

    try:
        # Update the integration to have NEVER passthrough
        print("1. Updating Mock integration passthrough behavior...")
        client.update_integration(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            patchOperations=[
                {
                    'op': 'replace',
                    'path': '/passthroughBehavior',
                    'value': 'NEVER'
                }
            ]
        )
        print("   [OK] Passthrough set to NEVER")

        # Update integration response template to be empty string not null
        print("2. Fixing response template...")
        client.update_integration_response(
            restApiId=API_ID,
            resourceId=resource_id,
            httpMethod='OPTIONS',
            statusCode='200',
            patchOperations=[
                {
                    'op': 'replace',
                    'path': '/responseTemplates/application~1json',
                    'value': '#set($context.responseOverride.status = 200)'
                }
            ]
        )
        print("   [OK] Response template fixed")

        print(f"[SUCCESS] Integration response fixed for {path}")

    except Exception as e:
        print(f"[ERROR] Failed to fix {path}: {e}")
        import traceback
        traceback.print_exc()

# Fix all resources
for resource_id, path in resources.items():
    fix_integration_response(resource_id, path)

# Deploy
print("\n=== Deploying to prod ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Fix OPTIONS Mock response template'
)
print(f"[OK] Deployed! Deployment ID: {response['id']}")
print(f"\n[SUCCESS] Try again: curl -X OPTIONS -I https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod/api/products")

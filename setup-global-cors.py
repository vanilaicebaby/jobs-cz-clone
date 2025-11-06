import boto3

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'
ALLOWED_ORIGIN = 'https://workuj.cz'

client = boto3.client('apigateway', region_name=REGION)

def get_all_resources():
    """Get all resources in the API"""
    resources = []
    paginator = client.get_paginator('get_resources')

    for page in paginator.paginate(restApiId=API_ID):
        resources.extend(page['items'])

    return resources

def enable_cors_for_resource(resource):
    """Enable CORS for a specific resource"""
    resource_id = resource['id']
    path = resource.get('path', '/')

    # Skip root resource
    if path == '/':
        return

    print(f"\n=== Processing {path} (ID: {resource_id}) ===")

    try:
        # 1. Create OPTIONS method
        print("1. Creating OPTIONS method...")
        try:
            client.put_method(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='OPTIONS',
                authorizationType='NONE',
                apiKeyRequired=False
            )
            print("   [OK] OPTIONS method created")
        except client.exceptions.ConflictException:
            print("   [OK] OPTIONS method already exists")
        except Exception as e:
            print(f"   [SKIP] Cannot create OPTIONS: {e}")
            return

        # 2. Create Mock integration
        print("2. Creating Mock integration...")
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

        # 3. Create method response
        print("3. Creating method response...")
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

        # 4. Update integration with correct passthrough behavior
        print("4. Updating integration passthrough...")
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

        # 5. Create integration response with CORS headers
        print("5. Creating integration response...")
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
                'application/json': '#set($context.responseOverride.status = 200)'
            }
        )
        print("   [OK] Integration response created")

        print(f"[SUCCESS] CORS enabled for {path}")

    except Exception as e:
        print(f"[ERROR] Failed to enable CORS for {path}: {e}")

# Main execution
print("=== Finding all API Gateway resources ===\n")
all_resources = get_all_resources()

print(f"Found {len(all_resources)} resources\n")

# Filter out root and enable CORS for all others
resources_to_process = [r for r in all_resources if r.get('path') != '/']

print(f"Processing {len(resources_to_process)} resources (excluding root):\n")
for r in resources_to_process:
    print(f"  - {r.get('path', '/')} (ID: {r['id']})")

print("\n" + "="*60)
input("Press Enter to continue and enable CORS on all resources...")
print("="*60 + "\n")

# Enable CORS for all resources
for resource in resources_to_process:
    enable_cors_for_resource(resource)

# Deploy changes
print("\n" + "="*60)
print("=== Deploying to prod stage ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Global CORS setup for all resources'
)
print(f"[OK] Deployed! Deployment ID: {response['id']}")
print("\n[SUCCESS] Global CORS setup complete!")
print(f"API URL: https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod")
print("="*60)

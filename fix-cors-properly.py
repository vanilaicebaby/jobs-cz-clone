import boto3
import json

# Konfigurace
API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'
ALLOWED_ORIGIN = 'https://workuj.cz'

client = boto3.client('apigateway', region_name=REGION)

# Resources that need CORS
resources = {
    'sxmrhv': '/api/products',
    'xxjewm': '/api/products/{id}',
    'l77mr2': '/api/health',
    'sm0pridv17': '/'
}

def enable_cors_for_resource(resource_id, path):
    print(f"\n=== Configuring CORS for {path} (resource: {resource_id}) ===")

    try:
        # 1. Put OPTIONS method
        print("1. Creating OPTIONS method...")
        try:
            client.put_method(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='OPTIONS',
                authorizationType='NONE'
            )
            print("   [OK] OPTIONS method created")
        except client.exceptions.ConflictException:
            print("   [OK] OPTIONS method already exists")

        # 2. Put Mock Integration for OPTIONS
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

        # 3. Put Method Response for OPTIONS
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
            }
        )
        print("   [OK] Method response created")

        # 4. Put Integration Response for OPTIONS with CORS headers
        print("4. Creating integration response with CORS headers...")
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
        print("   [OK] Integration response created with CORS headers")

        # 5. Update GET method response to include CORS header parameter
        print("5. Updating GET method response...")
        try:
            client.put_method_response(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='GET',
                statusCode='200',
                responseParameters={
                    'method.response.header.Access-Control-Allow-Origin': False
                }
            )
            print("   [OK] GET method response updated")
        except Exception as e:
            print(f"   ! GET method response: {e}")

        # 6. Update GET integration response to include CORS header
        print("6. Updating GET integration response...")
        try:
            client.update_integration_response(
                restApiId=API_ID,
                resourceId=resource_id,
                httpMethod='GET',
                statusCode='200',
                patchOperations=[
                    {
                        'op': 'add',
                        'path': '/responseParameters/method.response.header.Access-Control-Allow-Origin',
                        'value': f"'{ALLOWED_ORIGIN}'"
                    }
                ]
            )
            print("   [OK] GET integration response updated with CORS header")
        except Exception as e:
            print(f"   ! GET integration response: {e}")

        print(f"[SUCCESS] CORS configured for {path}")

    except Exception as e:
        print(f"[ERROR] Error configuring {path}: {e}")

# Configure CORS for all resources
for resource_id, path in resources.items():
    enable_cors_for_resource(resource_id, path)

# Deploy changes
print("\n=== Deploying to 'prod' stage ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='CORS configuration update'
)
print(f"[OK] Deployed! Deployment ID: {response['id']}")
print(f"\n[SUCCESS] CORS setup complete!")
print(f"API URL: https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod")

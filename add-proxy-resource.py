import boto3

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'
ALLOWED_ORIGIN = 'https://workuj.cz'

client = boto3.client('apigateway', region_name=REGION)

print("=== Adding {proxy+} resource to /api ===\n")

# Get /api resource ID
resources = client.get_resources(restApiId=API_ID)
api_resource = None
for r in resources['items']:
    if r.get('path') == '/api':
        api_resource = r
        break

if not api_resource:
    print("[ERROR] /api resource not found")
    exit(1)

api_resource_id = api_resource['id']
print(f"Found /api resource: {api_resource_id}")

# Create proxy+ resource under /api
print("\n1. Creating {proxy+} resource...")
try:
    proxy_resource = client.create_resource(
        restApiId=API_ID,
        parentId=api_resource_id,
        pathPart='{proxy+}'
    )
    proxy_resource_id = proxy_resource['id']
    print(f"   [OK] Created {{proxy+}} resource: {proxy_resource_id}")
except client.exceptions.ConflictException:
    # Resource already exists, get its ID
    resources = client.get_resources(restApiId=API_ID)
    for r in resources['items']:
        if r.get('pathPart') == '{proxy+}' and r.get('parentId') == api_resource_id:
            proxy_resource_id = r['id']
            print(f"   [OK] {{proxy+}} resource already exists: {proxy_resource_id}")
            break

# Get Lambda function ARN
print("\n2. Getting Lambda function ARN...")
lambda_client = boto3.client('lambda', region_name=REGION)
lambda_fn = lambda_client.get_function(FunctionName='workuj-backend-prod-app')
lambda_arn = lambda_fn['Configuration']['FunctionArn']
print(f"   [OK] Lambda ARN: {lambda_arn}")

# Create ANY method with AWS_PROXY integration
print("\n3. Creating ANY method on {proxy+}...")
try:
    client.put_method(
        restApiId=API_ID,
        resourceId=proxy_resource_id,
        httpMethod='ANY',
        authorizationType='NONE',
        apiKeyRequired=True,
        requestParameters={}
    )
    print("   [OK] ANY method created")
except client.exceptions.ConflictException:
    print("   [OK] ANY method already exists")

# Create Lambda integration
print("\n4. Creating AWS_PROXY integration...")
uri = f'arn:aws:apigateway:{REGION}:lambda:path/2015-03-31/functions/{lambda_arn}/invocations'
client.put_integration(
    restApiId=API_ID,
    resourceId=proxy_resource_id,
    httpMethod='ANY',
    type='AWS_PROXY',
    integrationHttpMethod='POST',
    uri=uri
)
print("   [OK] AWS_PROXY integration created")

# Create OPTIONS method for CORS
print("\n5. Creating OPTIONS method...")
try:
    client.put_method(
        restApiId=API_ID,
        resourceId=proxy_resource_id,
        httpMethod='OPTIONS',
        authorizationType='NONE',
        apiKeyRequired=False
    )
    print("   [OK] OPTIONS method created")
except client.exceptions.ConflictException:
    print("   [OK] OPTIONS method already exists")

# Create Mock integration for OPTIONS
print("\n6. Creating Mock integration for OPTIONS...")
client.put_integration(
    restApiId=API_ID,
    resourceId=proxy_resource_id,
    httpMethod='OPTIONS',
    type='MOCK',
    requestTemplates={
        'application/json': '{"statusCode": 200}'
    }
)
print("   [OK] Mock integration created")

# Update passthrough behavior
print("\n7. Setting passthrough to NEVER...")
client.update_integration(
    restApiId=API_ID,
    resourceId=proxy_resource_id,
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

# Create method response for OPTIONS
print("\n8. Creating method response for OPTIONS...")
try:
    client.put_method_response(
        restApiId=API_ID,
        resourceId=proxy_resource_id,
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
except client.exceptions.ConflictException:
    print("   [OK] Method response already exists")

# Create integration response for OPTIONS
print("\n9. Creating integration response for OPTIONS...")
client.put_integration_response(
    restApiId=API_ID,
    resourceId=proxy_resource_id,
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

# Add Lambda permission
print("\n10. Adding Lambda invoke permission...")
try:
    lambda_client.add_permission(
        FunctionName='workuj-backend-prod-app',
        StatementId=f'apigateway-proxy-{API_ID}',
        Action='lambda:InvokeFunction',
        Principal='apigateway.amazonaws.com',
        SourceArn=f'arn:aws:execute-api:{REGION}:615299768293:{API_ID}/*/*'
    )
    print("   [OK] Lambda permission added")
except lambda_client.exceptions.ResourceConflictException:
    print("   [OK] Lambda permission already exists")

# Deploy
print("\n11. Deploying to prod stage...")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Add {proxy+} resource for all API routes'
)
print(f"   [OK] Deployed! Deployment ID: {response['id']}")

print("\n" + "="*60)
print("[SUCCESS] Proxy resource setup complete!")
print(f"All routes under /api/* now route to Lambda")
print(f"Test: curl -H 'x-api-key: ...' https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod/api/auth/register")
print("="*60)

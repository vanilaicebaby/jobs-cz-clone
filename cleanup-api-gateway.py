import boto3

API_ID = 'ldw0ca0cx6'
REGION = 'eu-central-1'

client = boto3.client('apigateway', region_name=REGION)

print("=== Cleaning up API Gateway - removing specific resources ===\n")

# Get all resources
resources = client.get_resources(restApiId=API_ID)

# Find resources to delete (keep only root and /api with {proxy+})
resources_to_keep = ['/', '/api', '/api/{proxy+}']
resources_to_delete = []

for r in resources['items']:
    path = r.get('path', '/')
    if path not in resources_to_keep:
        resources_to_delete.append({
            'id': r['id'],
            'path': path
        })

print(f"Resources to DELETE ({len(resources_to_delete)}):")
for r in resources_to_delete:
    print(f"  - {r['path']} (ID: {r['id']})")

print(f"\nResources to KEEP ({len(resources_to_keep)}):")
for path in resources_to_keep:
    print(f"  - {path}")

print("\n" + "="*60)
confirm = input("Type 'yes' to delete specific resources and keep only proxy+: ")
print("="*60 + "\n")

if confirm.lower() != 'yes':
    print("[CANCELLED] No changes made")
    exit(0)

# Delete resources (children first, then parents)
# Sort by path depth (deepest first)
resources_to_delete.sort(key=lambda x: x['path'].count('/'), reverse=True)

for r in resources_to_delete:
    print(f"Deleting {r['path']} (ID: {r['id']})...")
    try:
        client.delete_resource(
            restApiId=API_ID,
            resourceId=r['id']
        )
        print(f"  [OK] Deleted {r['path']}")
    except Exception as e:
        print(f"  [ERROR] Failed to delete {r['path']}: {e}")

# Deploy changes
print("\n" + "="*60)
print("=== Deploying to prod stage ===")
response = client.create_deployment(
    restApiId=API_ID,
    stageName='prod',
    description='Cleanup: remove specific resources, use only {proxy+}'
)
print(f"[OK] Deployed! Deployment ID: {response['id']}")
print("\n[SUCCESS] Cleanup complete!")
print(f"\nNow ALL routes go through /api/{{proxy+}} to Lambda")
print(f"API URL: https://{API_ID}.execute-api.{REGION}.amazonaws.com/prod/api")
print("="*60)

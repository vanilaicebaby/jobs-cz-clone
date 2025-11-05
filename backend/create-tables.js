import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists
} from '@aws-sdk/client-dynamodb';

const REGION = 'eu-central-1';
const client = new DynamoDBClient({ region: REGION });

// Table definitions
const tables = [
  {
    name: 'carbon-parts-users',
    definition: {
      TableName: 'carbon-parts-users',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'EmailIndex',
          KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
  {
    name: 'carbon-parts-orders',
    definition: {
      TableName: 'carbon-parts-orders',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UserIdIndex',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      ],
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  },
];

async function tableExists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error.name === 'ResourceNotFoundException') {
      return false;
    }
    throw error;
  }
}

async function createTables() {
  console.log('=== Creating DynamoDB Tables ===\n');

  for (const table of tables) {
    try {
      const exists = await tableExists(table.name);

      if (exists) {
        console.log(`✓ Table ${table.name} already exists`);
        continue;
      }

      console.log(`Creating table: ${table.name}...`);
      await client.send(new CreateTableCommand(table.definition));

      console.log(`  Waiting for table ${table.name} to become active...`);
      await waitUntilTableExists(
        { client, maxWaitTime: 60 },
        { TableName: table.name }
      );

      console.log(`✓ Table ${table.name} created successfully\n`);
    } catch (error) {
      console.error(`✗ Error creating table ${table.name}:`, error.message);
    }
  }

  console.log('\n=== Table Creation Complete ===');
  console.log('\nTables created:');
  console.log('  - carbon-parts-users (with EmailIndex)');
  console.log('  - carbon-parts-orders (with UserIdIndex)');
}

createTables();

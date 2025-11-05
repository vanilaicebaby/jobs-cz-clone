import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { readFile } from 'fs/promises';

// Konfigurace
const REGION = process.env.AWS_REGION || 'eu-central-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'carbon-parts-products';

// Inicializace DynamoDB klienta
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function importProducts() {
  try {
    // Načtení produktů z JSON souboru
    const productsJson = await readFile('./products.json', 'utf-8');
    const products = JSON.parse(productsJson);

    console.log(`🚀 Importuji ${products.length} produktů do DynamoDB tabulky: ${TABLE_NAME}`);
    console.log(`📍 Region: ${REGION}\n`);

    let successCount = 0;
    let errorCount = 0;

    // Import každého produktu
    for (const product of products) {
      try {
        const command = new PutCommand({
          TableName: TABLE_NAME,
          Item: product
        });

        await docClient.send(command);
        console.log(`✅ Importován produkt: ${product.id} - ${product.name}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Chyba při importu produktu ${product.id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Import dokončen:`);
    console.log(`   ✅ Úspěšně: ${successCount}`);
    console.log(`   ❌ Chyby: ${errorCount}`);
    console.log(`   📦 Celkem: ${products.length}`);

  } catch (error) {
    console.error('❌ Kritická chyba při importu:', error);
    process.exit(1);
  }
}

// Spuštění importu
importProducts();

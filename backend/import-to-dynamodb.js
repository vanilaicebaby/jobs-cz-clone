import 'dotenv/config';
import axios from 'axios';
import cheerio from 'cheerio';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';

const DEFAULT_URL = 'https://www.made-in-china.com/productdirectory.do?subaction=hunt&style=b&mode=and&code=0&comProvince=nolimit&order=0&isOpenCorrection=1&org=top&keyword=&file=&searchType=0&word=M3+lip&log_from=4&bv_id=1j9c5mv1s4e9';

const REGION = process.env.AWS_REGION || 'eu-central-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || process.env.DYNAMODB_TABLE_PRODUCTS || 'carbon-parts-products';
const PAGES = parseInt(process.env.PAGES || '1', 10);
const BASE_URL = process.env.SOURCE_URL || DEFAULT_URL;
const S3_BUCKET = process.env.S3_BUCKET || '';
const S3_PREFIX = (process.env.S3_PREFIX || 'products/made-in-china').replace(/\/$/, '');
const S3_PUBLIC_URL_BASE = process.env.S3_PUBLIC_URL_BASE || '';
const S3_ACL = process.env.S3_ACL || 'public-read';
const UPLOAD_CONCURRENCY = parseInt(process.env.UPLOAD_CONCURRENCY || '5', 10);

function stableIdFromUrl(url) {
  const hash = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(url)));
  return hash.toString('hex').slice(0, 24);
}

function stableIdFromUrlSync(url) {
  // Node sync fallback (simple hash)
  let h1 = 0x811c9dc5;
  for (let i = 0; i < url.length; i++) {
    h1 ^= url.charCodeAt(i);
    h1 = (h1 + (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24)) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + '000000000000000000000000'.slice(0, 16);
}

function buildHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Connection: 'keep-alive',
  };
}

function discoverPagedUrls(baseUrl, pages) {
  if (pages <= 1) return [baseUrl];
  const sep = baseUrl.includes('?') ? '&' : '?';
  const urls = [baseUrl];
  for (let p = 2; p <= pages; p++) urls.push(`${baseUrl}${sep}page=${p}`);
  return urls;
}

function parsePrice(value) {
  if (!value) return 0;
  const m = value.match(/\d+[\d,.]*/);
  if (!m) return 0;
  try {
    return parseInt(m[0].replace(/\.|,/g, ''), 10) || 0;
  } catch (_) {
    return 0;
  }
}

function mapToProduct(item) {
  const id = stableIdFromUrlSync(item.productUrl);
  const price = parsePrice(item.priceText);
  return {
    // Keys expected by our backend/FE
    pk: `prod#${id}`,
    sk: 'prod',
    id,
    name: item.title,
    price,
    image: item.imageUrl || '',
    images: item.imageUrl ? [item.imageUrl] : [],
    description: '',
    specifications: [],
    features: [],
    category: 'BMW M3/M4 | Exteriér',
    // Admin metadata
    productUrl: item.productUrl,
    imageLocalPath: '',
    priceText: item.priceText || '',
    moqText: item.moqText || '',
    supplierName: item.supplierName || '',
    supplierUrl: item.supplierUrl || '',
    source: 'made-in-china',
    updatedAt: Math.floor(Date.now() / 1000),
  };
}

async function fetchPage(url) {
  const res = await axios.get(url, { headers: buildHeaders(), timeout: 20000 });
  return res.data;
}

async function downloadImageBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000, headers: buildHeaders() });
  const contentType = res.headers['content-type'] || mime.lookup(new URL(url).pathname) || 'application/octet-stream';
  return { buffer: Buffer.from(res.data), contentType };
}

function sanitizeFileName(name) {
  return (name || 'image').toLowerCase().replace(/[^a-z0-9._-]+/gi, '_').replace(/^[_.-]+|[_.-]+$/g, '').slice(0, 80) || 'image';
}

function buildS3Key(productId, title, imageUrl) {
  const extGuess = mime.extension(mime.lookup(new URL(imageUrl).pathname) || '') || 'jpg';
  const base = sanitizeFileName(title) || productId;
  return `${S3_PREFIX}/${productId}/${base}.${extGuess}`;
}

function buildPublicUrlFromKey(region, bucket, key) {
  if (S3_PUBLIC_URL_BASE) {
    return `${S3_PUBLIC_URL_BASE.replace(/\/$/, '')}/${key}`;
  }
  const r = region === 'us-east-1' ? '' : `-${region}`;
  return `https://${bucket}.s3${r}.amazonaws.com/${encodeURI(key)}`;
}

async function ensureUploadToS3(s3, region, bucket, key, imageUrl) {
  // Skip upload if object exists
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return buildPublicUrlFromKey(region, bucket, key);
  } catch (_) {}

  const { buffer, contentType } = await downloadImageBuffer(imageUrl);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: contentType, ACL: S3_ACL }));
  return buildPublicUrlFromKey(region, bucket, key);
}

function parseProductsFromHtml(html) {
  const $ = cheerio.load(html);
  const products = [];
  const candidates = [
    'div.product-item',
    'div.list-item',
    'div.list-product',
    'div.pro-item',
    'li.product',
    'li.pro-item',
    'div[data-s-virtual]'
  ];

  let cards = [];
  for (const sel of candidates) {
    const found = $(sel).toArray();
    if (found.length) { cards = found; break; }
  }

  for (const el of cards) {
    const node = $(el);
    const a = node.find('a[href]').first();
    const title = a.attr('title') || a.text().trim();
    let productUrl = a.attr('href') || '';
    if (productUrl.startsWith('/')) productUrl = `https://www.made-in-china.com${productUrl}`;

    const img = node.find('img').first();
    let imageUrl = img.attr('data-src') || img.attr('data-original') || img.attr('src') || '';
    if (imageUrl.startsWith('//')) imageUrl = `https:${imageUrl}`;

    const priceText = (node.text().match(/(US\$|\$|price)[^\n]{0,50}/i) || [])[0] || '';
    const moqText = (node.text().match(/(MOQ|Min\.|Minimum\s+Order)[^\n]{0,50}/i) || [])[0] || '';

    const supplierLink = node.find('a[href*="company"], a[href*="supplier"]').first();
    const supplierName = supplierLink.attr('title') || supplierLink.text().trim() || '';
    let supplierUrl = supplierLink.attr('href') || '';
    if (supplierUrl.startsWith('/')) supplierUrl = `https://www.made-in-china.com${supplierUrl}`;

    if (productUrl && title) {
      products.push({ title, productUrl, imageUrl, priceText, moqText, supplierName, supplierUrl });
    }
  }

  // Deduplicate by URL
  const unique = new Map();
  for (const p of products) unique.set(p.productUrl, p);
  return Array.from(unique.values());
}

async function batchWriteAll(docClient, tableName, items) {
  const chunks = [];
  const size = 25;
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  for (const chunk of chunks) {
    const params = { RequestItems: { [tableName]: chunk.map(Item => ({ PutRequest: { Item } })) } };
    const res = await docClient.send(new BatchWriteCommand(params));
    // Retry unprocessed
    let unprocessed = res.UnprocessedItems?.[tableName] || [];
    let attempts = 0;
    while (unprocessed.length && attempts < 5) {
      await new Promise(r => setTimeout(r, 500 * (attempts + 1)));
      const retryRes = await docClient.send(new BatchWriteCommand({ RequestItems: { [tableName]: unprocessed } }));
      unprocessed = retryRes.UnprocessedItems?.[tableName] || [];
      attempts++;
    }
    if (unprocessed.length) {
      console.warn(`Warning: ${unprocessed.length} unprocessed items after retries`);
    }
  }
}

async function main() {
  console.log(`Region: ${REGION}`);
  console.log(`Table: ${TABLE_NAME}`);
  console.log(`Source URL: ${BASE_URL} (pages=${PAGES})`);
  if (S3_BUCKET) {
    console.log(`S3 Bucket: ${S3_BUCKET} (prefix: ${S3_PREFIX})`);
  } else {
    console.log('S3 Bucket not set; images will remain external URLs');
  }

  const urls = discoverPagedUrls(BASE_URL, PAGES);
  const all = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Fetching ${url}`);
    const html = await fetchPage(url);
    const pageItems = parseProductsFromHtml(html);
    console.log(`Parsed ${pageItems.length} items from page ${i + 1}`);
    all.push(...pageItems);
    if (i < urls.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
  // Optionally upload images to S3
  if (S3_BUCKET) {
    const s3 = new S3Client({ region: REGION });
    let active = 0;
    let index = 0;
    const results = new Array(all.length);
    await new Promise((resolve, reject) => {
      const next = () => {
        if (index >= all.length && active === 0) return resolve();
        while (active < UPLOAD_CONCURRENCY && index < all.length) {
          const i = index++;
          active++;
          (async () => {
            try {
              const p = all[i];
              if (p.imageUrl) {
                const key = buildS3Key(stableIdFromUrlSync(p.productUrl), p.title, p.imageUrl);
                const publicUrl = await ensureUploadToS3(s3, REGION, S3_BUCKET, key, p.imageUrl);
                p.imageUrl = publicUrl;
              }
              results[i] = p;
            } catch (e) {
              // keep external URL on failure
              results[i] = all[i];
            } finally {
              active--;
              next();
            }
          })();
        }
      };
      next();
    });
  }

  // Map to FE structure + keys
  const items = all.map(mapToProduct);
  console.log(`Upserting ${items.length} items to DynamoDB`);

  const client = new DynamoDBClient({ region: REGION });
  const doc = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });
  await batchWriteAll(doc, TABLE_NAME, items);
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


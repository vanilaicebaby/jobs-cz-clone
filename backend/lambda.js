import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const app = express();

// DynamoDB konfigurace
const REGION = process.env.AWS_REGION || 'eu-central-1';
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'carbon-parts-products';
const USERS_TABLE = 'carbon-parts-users';
const ORDERS_TABLE = 'carbon-parts-orders';

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Helper functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateId() {
  return crypto.randomUUID();
}

// CORS konfigurace
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://workuj.cz',
    'https://www.workuj.cz',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Explicitní CORS headers pro všechny odpovědi
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://workuj.cz');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,x-api-key');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');

  next();
});

// Mock Data
const mockProducts = [
  {
    id: '1',
    name: 'Karbonový Difuzor Vzor CSL pro BMW M4 G82',
    category: 'BMW M4 G82 | Exteriér',
    price: 45900,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: true,
    description:
      'Prémiový karbonový difuzor ve stylu CSL pro BMW M4 G82. Vyroben z autoklávu vytvrzeného dry carbonu s perfektním OEM fitmentem. Zvyšuje agresivní vzhled zadní části vozidla a zlepšuje aerodynamiku.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber (Autokláv)' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: '100% OEM' },
      { label: 'Kompatibilita', value: 'BMW M4 G82 (2021+)' },
      { label: 'Montáž', value: 'Plug & Play' },
      { label: 'Hmotnost', value: '2.5 kg' },
    ],
    features: [
      '100% autokláv vytvrzený dry carbon',
      'Perfektní OEM fitment bez úprav',
      'UV ochranná vrstva proti vyblednutí',
      'Zlepšená aerodynamika a downforce',
      'Snížená hmotnost oproti OEM',
      'Instalační sada v balení',
    ],
  },
  {
    id: '2',
    name: 'Karbonová Kapota pro BMW M3 F80',
    category: 'BMW M3 F80 | Exteriér',
    price: 89900,
    image: 'https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: false,
    description:
      'Lehká karbonová kapota pro BMW M3 F80 s větrací mřížkou. Ušetří až 8 kg oproti originální kapotě a dodá vozu výrazný sportovní vzhled.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber (Autokláv)' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: '100% OEM' },
      { label: 'Kompatibilita', value: 'BMW M3 F80 (2014-2018)' },
      { label: 'Montáž', value: 'Direct Replacement' },
      { label: 'Úspora hmotnosti', value: '-8 kg' },
    ],
    features: [
      'Autokláv vytvrzený dry carbon',
      'Snížení hmotnosti o 8 kg',
      'Větrací mřížka pro lepší chlazení',
      'UV ochranná vrstva',
      'OEM těsnění v balení',
      'Snadná instalace',
    ],
  },
  {
    id: '3',
    name: 'Karbonové Kryty Zrcátek M Performance',
    category: 'BMW M4 G82 | Exteriér',
    price: 18900,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: true,
    description:
      'Prémiové karbonové kryty zpětných zrcátek ve stylu M Performance pro BMW M4 G82/G83. Perfektní doplněk exteriéru.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: '100% OEM' },
      { label: 'Kompatibilita', value: 'BMW M4 G82/G83 (2021+)' },
      { label: 'Montáž', value: 'Clip-On (2 minuty)' },
      { label: 'Obsah balení', value: '2x kryt (L+R)' },
    ],
    features: [
      'Dry carbon fiber konstrukce',
      'Clip-on instalace bez úprav',
      'UV ochrana',
      'Perfektní přesnost',
      'Lehké a odolné',
      'M Performance design',
    ],
  },
  {
    id: '4',
    name: 'Karbonový Spoiler CSL pro BMW M4 G82',
    category: 'BMW M4 G82 | Exteriér',
    price: 52900,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
    ],
    isNew: true,
    description:
      'Ikonický karbonový spoiler ve stylu CSL pro BMW M4 G82. Dodá vozu výrazný a agresivní vzhled inspirovaný závodními speciály.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber (Autokláv)' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: 'CSL Style' },
      { label: 'Kompatibilita', value: 'BMW M4 G82 (2021+)' },
      { label: 'Montáž', value: 'Bolt-On' },
      { label: 'Hmotnost', value: '3.2 kg' },
    ],
    features: [
      'CSL inspirovaný design',
      'Autokláv vytvrzený carbon',
      'Zlepšení aerodynamiky',
      'Všechny montážní díly v balení',
      'UV ochranná vrstva',
      'Profesionální instalace doporučena',
    ],
  },
  {
    id: '5',
    name: 'Karbonový Přední Splitter M Performance',
    category: 'BMW M3 F80 | Exteriér',
    price: 28900,
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: false,
    description:
      'Agresivní karbonový přední splitter ve stylu M Performance pro BMW M3 F80. Zlepšuje přítlak a dodává vozu závodní vzhled.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: '100% OEM' },
      { label: 'Kompatibilita', value: 'BMW M3 F80 (2014-2018)' },
      { label: 'Montáž', value: 'Bolt-On' },
      { label: 'Hmotnost', value: '1.8 kg' },
    ],
    features: [
      'M Performance design',
      'Zvýšený přítlak na přední nápravu',
      'Dry carbon konstrukce',
      'Kompletní montážní sada',
      'UV ochrana',
      'OEM kvalita',
    ],
  },
  {
    id: '6',
    name: 'Karbonové Boční Prahy M4 CSL',
    category: 'BMW M4 G82 | Exteriér',
    price: 68900,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: true,
    description:
      'Kompletní sada karbonových bočních prahů ve stylu CSL pro BMW M4 G82. Dodává vozu extrémně agresivní boční linii.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber (Autokláv)' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: 'CSL Style' },
      { label: 'Kompatibilita', value: 'BMW M4 G82 (2021+)' },
      { label: 'Montáž', value: 'Bolt-On' },
      { label: 'Obsah', value: '2x práh (L+R)' },
    ],
    features: [
      'CSL inspirovaný design',
      'Sada pro obě strany vozidla',
      'Autokláv vytvrzený carbon',
      'UV ochranná vrstva',
      'Montážní sada v balení',
      'Dramatický vizuální efekt',
    ],
  },
  {
    id: '7',
    name: 'Karbonový Kryt Motoru S58',
    category: 'BMW M4 G82 | Interiér',
    price: 34900,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1610768764270-790fbec18178?q=80&w=500',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    ],
    isNew: false,
    description:
      'Exkluzivní karbonový kryt motoru S58 pro BMW M3/M4 G80/G82. Perfektní detail pro show přípravu motorového prostoru.',
    specifications: [
      { label: 'Materiál', value: 'Dry Carbon Fiber' },
      { label: 'Povrchová úprava', value: '2x2 Twill Weave' },
      { label: 'Fitment', value: '100% OEM' },
      { label: 'Kompatibilita', value: 'BMW M3/M4 G80/G82 S58' },
      { label: 'Montáž', value: 'Direct Replacement' },
      { label: 'Úspora hmotnosti', value: '-2.5 kg' },
    ],
    features: [
      'Dry carbon konstrukce',
      'OEM fitment',
      'Snížení hmotnosti',
      'Prémiový vzhled',
      'UV ochrana',
      'Show-quality finish',
    ],
  },
  {
    id: '8',
    name: 'Karbonový Výfukový Systém Akrapovič',
    category: 'BMW M4 G82 | Výfuk',
    price: 189900,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=500',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500',
    ],
    isNew: true,
    description:
      'Top prémiový kompletní výfukový systém Akrapovič s karbonovými koncovkami pro BMW M4 G82. Brutální zvuk a výkon.',
    specifications: [
      { label: 'Materiál', value: 'Titan + Carbon koncovky' },
      { label: 'Průměr', value: '4x 100mm' },
      { label: 'Výkon', value: '+18 HP' },
      { label: 'Kompatibilita', value: 'BMW M4 G82 (2021+)' },
      { label: 'Montáž', value: 'Cat-Back System' },
      { label: 'Úspora hmotnosti', value: '-12 kg' },
    ],
    features: [
      'Akrapovič prémiová kvalita',
      'Karbonové koncovky 4x 100mm',
      'Titanové potrubí',
      '+18 HP, +25 Nm',
      'Agresivní zvuk',
      'Certifikováno pro veřejné komunikace',
    ],
  },
];

// Auth Middleware
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Query users table to find user with this token
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: 'authToken = :token',
      ExpressionAttributeValues: {
        ':token': token,
      },
    });

    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = response.Items[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

// Auth Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const checkCommand = new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    const existingUser = await docClient.send(checkCommand);

    if (existingUser.Items && existingUser.Items.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create new user
    const userId = generateId();
    const authToken = generateToken();
    const hashedPassword = hashPassword(password);

    const user = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || '',
      authToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      })
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
      token: authToken,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const command = new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = response.Items[0];
    const hashedPassword = hashPassword(password);

    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate new token
    const authToken = generateToken();

    // Update user with new token
    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: {
          ...user,
          authToken,
          updatedAt: new Date().toISOString(),
        },
      })
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: authToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

app.get('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { password: _, authToken: __, ...userWithoutSensitiveData } = req.user;
    res.json({ success: true, user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, street, city, postalCode, country } = req.body;

    const updatedUser = {
      ...req.user,
      firstName: firstName || req.user.firstName,
      lastName: lastName || req.user.lastName,
      phone: phone || req.user.phone,
      street: street || req.user.street || '',
      city: city || req.user.city || '',
      postalCode: postalCode || req.user.postalCode || '',
      country: country || req.user.country || '',
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: updatedUser,
      })
    );

    const { password: _, authToken: __, ...userWithoutSensitiveData } = updatedUser;
    res.json({ success: true, user: userWithoutSensitiveData });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Orders Routes
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order items required' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({ error: 'Delivery address required' });
    }

    const orderId = generateId();
    const order = {
      id: orderId,
      userId: req.user.id,
      userEmail: req.user.email,
      items,
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: ORDERS_TABLE,
        Item: order,
      })
    );

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
});

app.get('/orders', authenticateToken, async (req, res) => {
  try {
    const command = new QueryCommand({
      TableName: ORDERS_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.id,
      },
      ScanIndexForward: false, // Sort by createdAt DESC
    });

    const response = await docClient.send(command);
    res.json({ success: true, orders: response.Items || [] });
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
});

app.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const command = new QueryCommand({
      TableName: ORDERS_TABLE,
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': req.params.id,
      },
    });

    const response = await docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = response.Items[0];

    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Fetch order error:', error);
    res.status(500).json({ error: 'Failed to fetch order', message: error.message });
  }
});

// Products Routes
app.get('/products', async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    res.json(response.Items || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        id: req.params.id,
      },
    });

    const response = await docClient.send(command);

    if (response.Item) {
      res.json(response.Item);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', message: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root path
app.get('/', (req, res) => {
  res.json({ message: 'BMW Carbon Shop API', version: '1.0.0' });
});

// Export the serverless express handler
export const handler = serverlessExpress({ app });

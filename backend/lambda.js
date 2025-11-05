import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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

// Routes
app.get('/api/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find((p) => p.id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root path
app.get('/', (req, res) => {
  res.json({ message: 'BMW Carbon Shop API', version: '1.0.0' });
});

// Export the serverless express handler
export const handler = serverlessExpress({ app });

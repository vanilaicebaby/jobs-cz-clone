// Mockup uživatelů pro autentifikaci
export const MOCK_USERS = [
  {
    id: '1',
    email: 'jan.novak@email.cz',
    name: 'Jan Novák',
    password: 'heslo123',
    profile: {
      industry: 'IT',
      position: 'Frontend Developer',
      experience: 3
    }
  },
  {
    id: '2', 
    email: 'marie.svobodova@email.cz',
    name: 'Marie Svobodová',
    password: 'heslo456',
    profile: {
      industry: 'Finance',
      position: 'Finanční Analytik',
      experience: 5
    }
  }
];

// Mockup pracovních nabídek
export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Sociální Síť s.r.o.',
    location: 'Praha',
    salary: '80 000 - 120 000 CZK',
    tags: ['React', 'TypeScript', 'Frontend'],
    industry: 'IT',
    postedDate: '2024-03-15',
    description: 'Hledáme zkušeného Frontend vývojáře pro náš dynamický tým. Požadujeme solidní znalost Reactu, TypeScriptu a moderních webových technologií.'
  },
  {
    id: '2', 
    title: 'Finanční Analytik',
    company: 'Banka Nova a.s.',
    location: 'Praha',
    salary: '70 000 - 100 000 CZK', 
    tags: ['Finance', 'Excel', 'Analýza'],
    industry: 'Finance',
    postedDate: '2024-03-10',
    description: 'Připojte se k našemu finančnímu týmu a podílejte se na strategických rozhodnutích. Požadujeme analytické myšlení a zkušenosti s prací s daty.'
  },
  {
    id: '3',
    title: 'Všeobecná Sestra',
    company: 'Nemocnice Centrum',
    location: 'Brno',
    salary: '50 000 - 70 000 CZK',
    tags: ['Zdravotnictví', 'Péče', 'Komunikace'],
    industry: 'Zdravotnictví',
    postedDate: '2024-03-12', 
    description: 'Hledáme motivovanou všeobecnou sestru pro náš přátelský tým. Požadujeme empatický přístup a ochotu poskytovat kvalitní zdravotní péči.'
  },
  {
    id: '4',
    title: 'Marketing Specialista',
    company: 'E-commerce Platforma',
    location: 'Ostrava',
    salary: '60 000 - 90 000 CZK',
    tags: ['Marketing', 'Sociální Sítě', 'Strategie'],
    industry: 'Marketing',
    postedDate: '2024-03-18',
    description: 'Hledáme kreativního marketingového specialistu se zkušenostmi s řízením kampaní na sociálních sítích a tvorbou marketingových strategií.'
  },
  {
    id: '5',
    title: 'Konstruktér',
    company: 'Strojírenská Firma',
    location: 'Plzeň',
    salary: '65 000 - 95 000 CZK',
    tags: ['Strojírenství', 'CAD', 'Vývoj'],
    industry: 'Strojírenství',
    postedDate: '2024-03-14',
    description: 'Přijmeme zkušeného konstruktéra pro návrh a vývoj strojních zařízení. Požadujeme znalost CAD systémů a technického kreslení.'
  }
];

// Kategorie průmyslu
export const INDUSTRY_CATEGORIES = [
  'IT',
  'Finance', 
  'Zdravotnictví',
  'Marketing',
  'Strojírenství',
  'Obchod',
  'Administrativa',
  'Logistika'
];
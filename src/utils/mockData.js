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
    description: 'Hledáme zkušeného Frontend vývojáře pro náš dynamický tým.'
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
    description: 'Připojte se k našemu finančnímu týmu a podílejte se na strategických rozhodnutích.'
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
    description: 'Hledáme motivovanou všeobecnou sestru pro náš přátelský tým.'
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
  'administrativa',
  'Logistika'
];
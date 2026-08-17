export type Project = {
  number: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  tone: string;
};

export type StudioUpdate = {
  date: string;
  type: string;
  title: string;
  note: string;
};

export type JournalEntry = {
  number: string;
  category: string;
  title: string;
  excerpt: string;
};

export const projects: Project[] = [
  {
    number: '01',
    title: 'Kopi Senja',
    category: 'Hospitality / Concept',
    year: '2026',
    summary: 'A digital direction for a coffee house built around ritual, warmth, and everyday pause.',
    tone: 'linear-gradient(135deg, #1e264c 0%, #bba487 54%, #302521 100%)',
  },
  {
    number: '02',
    title: 'Eternal Moments',
    category: 'Wedding / Concept',
    year: '2026',
    summary: 'An editorial experience for a wedding studio that lets emotion lead the way.',
    tone: 'linear-gradient(135deg, #d8cdbb 0%, #8c6d63 52%, #171a2d 100%)',
  },
  {
    number: '03',
    title: 'Aruna Studio',
    category: 'Photography / Concept',
    year: '2026',
    summary: 'A visual-first portfolio study for creative work that deserves room to breathe.',
    tone: 'linear-gradient(135deg, #161616 0%, #53648a 56%, #d7c1a1 100%)',
  },
];

export const services = [
  {
    number: '01',
    title: 'Digital Architecture',
    description: 'Editorial websites and landing pages crafted to make a business legible, memorable, and trusted.',
  },
  {
    number: '02',
    title: 'Intelligent Systems',
    description: 'Quiet automation systems that reduce repetitive work behind the customer experience.',
  },
  {
    number: '03',
    title: 'Brand Experience',
    description: 'A considered digital direction connecting story, visual language, and practical growth.',
  },
];

export const updates: StudioUpdate[] = [
  {
    date: '18.08.26',
    type: 'Studio note',
    title: 'Conqueror Studio OS enters production validation.',
    note: 'The first website is being built as a living test of our studio system.',
  },
  {
    date: '12.08.26',
    type: 'Experiment',
    title: 'Renaissance light / modern interface.',
    note: 'An ongoing study of how classical composition can guide digital clarity.',
  },
  {
    date: '04.08.26',
    type: 'Archive',
    title: 'The first concept collection is open.',
    note: 'Three imagined directions for hospitality, wedding, and creative brands.',
  },
];

export const journal: JournalEntry[] = [
  {
    number: '01',
    category: 'Perspective',
    title: 'A beautiful website is only the beginning.',
    excerpt: 'Why a digital presence needs a point of view before it needs more features.',
  },
  {
    number: '02',
    category: 'Systems',
    title: 'The quiet power of invisible systems.',
    excerpt: 'Automation should feel less like technology and more like care made repeatable.',
  },
  {
    number: '03',
    category: 'Field notes',
    title: 'What makes a brand feel timeless online?',
    excerpt: 'A short study of restraint, rhythm, and the courage to leave space.',
  },
];

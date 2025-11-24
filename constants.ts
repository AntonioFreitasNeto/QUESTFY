
import { Question, User } from './types';

// Mock Users for Leaderboard
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://picsum.photos/100/100?random=1',
    score: 15420,
    streak: 12,
    city: 'São Paulo',
    state: 'SP',
    rankGlobal: 1,
    rankState: 1,
    rankCity: 1,
    isPremium: true,
    questionsAnswered: 1500,
    essayCredits: 5
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: 'https://picsum.photos/100/100?random=2',
    score: 14850,
    streak: 5,
    city: 'Rio de Janeiro',
    state: 'RJ',
    rankGlobal: 2,
    rankState: 1,
    rankCity: 1,
    isPremium: true,
    questionsAnswered: 1400,
    essayCredits: 2
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    avatar: 'https://picsum.photos/100/100?random=3',
    score: 13200,
    streak: 8,
    city: 'Belo Horizonte',
    state: 'MG',
    rankGlobal: 3,
    rankState: 1,
    rankCity: 1,
    isPremium: false,
    questionsAnswered: 50,
    essayCredits: 0
  },
  {
    id: 'you',
    name: 'Estudante', // Will be overwritten on login
    avatar: 'https://picsum.photos/100/100?random=99',
    score: 0,
    streak: 0,
    city: 'São Paulo',
    state: 'SP',
    rankGlobal: 999,
    rankState: 99,
    rankCity: 99,
    isPremium: false,
    questionsAnswered: 0, // Start at 0
    essayCredits: 0 // Start with 0 credits
  }
];

// Static questions to simulate past 5 years of ENEM
export const STATIC_QUESTIONS: Question[] = [
  {
    id: 'enem-2023-1',
    year: 2023,
    subject: 'Ciências Humanas',
    source: 'ENEM_STATIC',
    text: 'A construção de barragens em rios brasileiros para a geração de energia hidrelétrica tem gerado debates sobre impactos socioambientais. Um dos principais impactos negativos observados em comunidades ribeirinhas é:',
    options: [
      'O aumento da biodiversidade aquática local.',
      'O deslocamento forçado e a perda de territórios tradicionais.',
      'A redução imediata das tarifas de energia elétrica.',
      'A melhoria da qualidade da água potável.',
      'O fortalecimento das redes de pesca artesanal.'
    ],
    correctIndex: 1,
    explanation: 'A construção de grandes hidrelétricas frequentemente resulta no alagamento de vastas áreas, obrigando o deslocamento de populações ribeirinhas e indígenas, desarticulando seus modos de vida tradicionais.'
  },
  {
    id: 'enem-2022-1',
    year: 2022,
    subject: 'Matemática',
    source: 'ENEM_STATIC',
    text: 'Um aplicativo de transporte cobra uma taxa fixa de R$ 5,00 mais R$ 2,00 por quilômetro rodado. Se um passageiro pagou R$ 25,00 pela corrida, qual foi a distância percorrida?',
    options: [
      '8 km',
      '10 km',
      '12 km',
      '15 km',
      '20 km'
    ],
    correctIndex: 1,
    explanation: 'A função do preço é P(x) = 5 + 2x. Se P(x) = 25, então 25 = 5 + 2x -> 20 = 2x -> x = 10 km.'
  },
  {
    id: 'enem-2021-1',
    year: 2021,
    subject: 'Linguagens',
    source: 'ENEM_STATIC',
    text: 'O modernismo brasileiro, em sua primeira fase, caracterizou-se principalmente por:',
    options: [
      'Valorização do rigor formal e da métrica parnasiana.',
      'Busca por uma identidade nacional e ruptura com o academicismo.',
      'Imitação dos modelos clássicos greco-romanos.',
      'Pessimismo existencial e fuga da realidade.',
      'Defesa do uso da linguagem culta e erudita.'
    ],
    correctIndex: 1,
    explanation: 'A primeira geração modernista (fase heroica) buscou romper com os padrões do passado e afirmar uma identidade cultural brasileira autêntica.'
  },
  {
    id: 'enem-2020-1',
    year: 2020,
    subject: 'Ciências da Natureza',
    source: 'ENEM_STATIC',
    text: 'Durante o processo de fotossíntese, as plantas consomem dióxido de carbono e liberam oxigênio. Qual organela celular é responsável por esse processo?',
    options: [
      'Mitocôndria',
      'Ribossomo',
      'Cloroplasto',
      'Lisossomo',
      'Complexo de Golgi'
    ],
    correctIndex: 2,
    explanation: 'Os cloroplastos contêm clorofila e são as organelas responsáveis pela realização da fotossíntese nas células vegetais.'
  }
];

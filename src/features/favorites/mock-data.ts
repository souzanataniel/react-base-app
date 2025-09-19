// mockData.ts
export interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'E aí, tudo bem?',
    timestamp: '10:30',
    unreadCount: 3,
    isOnline: true
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Vamos marcar aquela reunião?',
    timestamp: '09:15',
    unreadCount: 1,
    isOnline: false
  },
  {
    id: '3',
    name: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Obrigada pela ajuda!',
    timestamp: 'Ontem',
    isOnline: true
  },
  {
    id: '4',
    name: 'João Pereira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Cheguei em casa!',
    timestamp: 'Ontem',
    unreadCount: 5,
    isOnline: false
  },
  {
    id: '5',
    name: 'Juliana Costa',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Você viu o novo filme?',
    timestamp: '12/12',
    isOnline: true
  },
  {
    id: '6',
    name: 'Pedro Almeida',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Preciso falar com você',
    timestamp: '11/12',
    unreadCount: 2,
    isOnline: false
  },
  {
    id: '7',
    name: 'Fernanda Lima',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Feliz aniversário! 🎉',
    timestamp: '10/12',
    isOnline: true
  },
  {
    id: '8',
    name: 'Ricardo Souza',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Mandei o arquivo por email',
    timestamp: '09/12',
    isOnline: false
  },
  {
    id: '9',
    name: 'Camila Rodrigues',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Até amanhã!',
    timestamp: '08/12',
    unreadCount: 1,
    isOnline: true
  },
  {
    id: '10',
    name: 'Lucas Martins',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'O que você achou?',
    timestamp: '07/12',
    isOnline: false
  },
  {
    id: '11',
    name: 'Patrícia Nunes',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Vamos no shopping?',
    timestamp: '06/12',
    unreadCount: 4,
    isOnline: true
  },
  {
    id: '12',
    name: 'Marcos Ferreira',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Preciso da sua opinião',
    timestamp: '05/12',
    isOnline: false
  },
  {
    id: '13',
    name: 'Tatiane Gomes',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Obrigada pelo presente!',
    timestamp: '04/12',
    isOnline: true
  },
  {
    id: '14',
    name: 'Roberto Silva',
    avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Fala brother!',
    timestamp: '03/12',
    unreadCount: 2,
    isOnline: false
  },
  {
    id: '15',
    name: 'Amanda Costa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Te espero lá!',
    timestamp: '02/12',
    isOnline: true
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Tudo bem?',
    timestamp: '10:00',
    isSent: false,
    isRead: true
  },
  {
    id: '2',
    text: 'Tudo sim, e com você?',
    timestamp: '10:01',
    isSent: true,
    isRead: true
  },
  {
    id: '3',
    text: 'Aqui tudo ótimo! O que você está fazendo?',
    timestamp: '10:02',
    isSent: false,
    isRead: true
  },
  {
    id: '4',
    text: 'Estou trabalhando no novo projeto, e você?',
    timestamp: '10:03',
    isSent: true,
    isRead: true
  },
  {
    id: '5',
    text: 'Estou estudando para a prova de matemática 😅',
    timestamp: '10:04',
    isSent: false,
    isRead: true
  },
  {
    id: '6',
    text: 'Boa sorte! Se precisar de ajuda, é só falar',
    timestamp: '10:05',
    isSent: true,
    isRead: true
  },
  {
    id: '7',
    text: 'Obrigada! Você é demais 💙',
    timestamp: '10:06',
    isSent: false,
    isRead: true
  },
  {
    id: '8',
    text: 'Hehe, disponha sempre!',
    timestamp: '10:07',
    isSent: true,
    isRead: true
  },
  {
    id: '9',
    text: 'Vamos marcar de sair no final de semana?',
    timestamp: '10:08',
    isSent: false,
    isRead: true
  },
  {
    id: '10',
    text: 'Claro! Que tal sábado à noite?',
    timestamp: '10:09',
    isSent: true,
    isRead: true
  }
];

// Application constants

// Navigation routes
export const APP_ROUTES = {
  HOME: '/',
  MAP: '/map',
  PROFILE: '/profile',
  ARTIFACTS: '/artifacts',
  CHAT: '/chat',
  SETTINGS: '/settings',
  FAQ: '/faq',
  LEVEL: (levelId: string) => `/level/${levelId}`,
};

// Auth routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
};

// Skills that can be improved in the application
export const SKILLS = [
  'leadership',
  'management',
  'finance',
  'marketing',
  'sales',
  'strategy',
  'productivity',
];

// BizLevel - Application Constants

// OpenAI Constants
export const OPENAI_MODEL = 'gpt-3.5-turbo';
export const MAX_TOKENS = 800;
export const TEMPERATURE = 0.5;

// System prompt for BizLevel assistant
export const SYSTEM_PROMPT = `You are an AI assistant for BizLevel, a platform that helps entrepreneurs improve their business skills through short videos, tests, and practical artifacts (templates, checklists, etc.).

Key information about BizLevel:
- BizLevel is a gamified learning platform with progressive level unlocking
- Each level contains short videos (2-4 minutes), interactive tests, and downloadable artifacts
- The platform focuses on business, entrepreneurship, and management topics
- Users progress through 10 levels, unlocking new content as they complete levels

As the BizLevel assistant, please:
- Introduce yourself as the BizLevel AI assistant when starting conversations
- Focus on business, entrepreneurship, and management topics
- Provide concise, practical advice that entrepreneurs can implement
- Refer to the level structure when relevant (Levels 1-10)
- Be friendly, professional, and encouraging
`; 
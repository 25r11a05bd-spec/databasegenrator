export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    CONFIRM: '/api/auth/confirm',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    UPDATE_PASSWORD: '/api/auth/update-password',
  },
  DATABASE: {
    HISTORY: '/api/database/history',
    CREATE: '/api/database/create',
    DELETE: (id: string | number) => `/api/database/${id}`,
    CONNECTION_STRING: '/api/database/connection-string',
  },
  GROQ: {
    PARSE: '/api/groq/parse',
    ADJUST: '/api/groq/adjust',
    CLARIFY: '/api/groq/clarify',
  },
  HEALTH: '/api/health',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  DATABASES: '/databases',
  GENERATOR: '/generator',
  GENERATOR_AI: '/generator/ai',
  GENERATOR_MANUAL: '/generator/manual',
} as const;

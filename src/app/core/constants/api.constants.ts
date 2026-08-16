export const API_ENDPOINTS = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  JIRA: {
    CHAMADOS: '/chamados',

    CONFIG: {
      PORTAIS: '/config/chamados/portais',
      CATEGORIAS: '/config/chamados/categorias',
    },
  },
} as const;
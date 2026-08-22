export const API_ENDPOINTS = {

  AUTH: {
    BASE: '/auth',

    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },

  JIRA: {

    CONFIG: {
      BASE: '/config/chamados',

      PORTAIS: '/portais',
      CATEGORIAS: '/categorias',
      SUBTOPICOS: '/subtopicos',
    },

    CHAMADOS: {
      BASE: '/chamados',
    },

  },

} as const;
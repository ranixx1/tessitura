export const APP_ROUTES = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password'
  },

  PORTAL: {
    ROOT: 'portal',
    DASHBOARD: 'dashboard',
    PROFILE: 'profile',
    SETTINGS: 'settings'
  },

  ADMIN: {
    ROOT: 'admin',
    DASHBOARD: 'dashboard',
    USERS: 'users',
    ROLES: 'roles',
    PERMISSIONS: 'permissions'
  },

  HELPDESK: {
    ROOT: 'helpdesk'
  },

  KYC: {
    ROOT: 'kyc'
  },

  ANALYTICS: {
    ROOT: 'analytics'
  }
} as const;
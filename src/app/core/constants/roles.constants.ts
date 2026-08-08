export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ANALYST: 'ANALYST'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
export const ROLES = {
  NORMAL: 'ROLE_NORMAL',
  ADMIN: 'ROLE_ADMIN',
  KYC_ANALYST: 'ROLE_KYC_ANALYST',
  SUPERADMIN: 'ROLE_SUPERADMIN',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
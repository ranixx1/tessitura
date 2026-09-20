import { AuditSummary } from './audit-summary';

export interface UserDetail {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  active: boolean;
  failedAttempts: number;
  createdAt: string;
  lastLogin: string | null;
  recentActivity: AuditSummary[];
}
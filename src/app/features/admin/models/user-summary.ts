export interface UserSummary {
  id: number;
  username: string;
  email: string;
  role: string;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
}
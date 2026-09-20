export interface AuditSummary {
  loginTime: string;
  ipAddress: string;
  success: boolean;
  failureReason: string | null;
  userAgent: string;
}
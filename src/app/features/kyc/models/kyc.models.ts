export enum DocumentType {
  IDENTITY_CARD = 'IDENTITY_CARD',
  DRIVER_LICENSE = 'DRIVER_LICENSE',
  PASSPORT = 'PASSPORT',
  BANK_STATEMENT = 'BANK_STATEMENT',
  PAY_SLIP = 'PAY_SLIP',
  UTILITY_BILL = 'UTILITY_BILL',
  PHONE_BILL = 'PHONE_BILL'
}

export enum SubmissionStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  MANUAL = 'MANUAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum RejectionReason {
  ILLEGIBLE_DOCUMENT = 'ILLEGIBLE_DOCUMENT',
  EXPIRED_DOCUMENT = 'EXPIRED_DOCUMENT',
  DAMAGED_DOCUMENT = 'DAMAGED_DOCUMENT',
  INCONSISTENT_DATA = 'INCONSISTENT_DATA',
  INVALID_DOCUMENT = 'INVALID_DOCUMENT',
  LOW_QUALITY_PHOTO = 'LOW_QUALITY_PHOTO',
  UNACCEPTED_DOCUMENT = 'UNACCEPTED_DOCUMENT',
  SUSPICION_OF_FRAUD = 'SUSPICION_OF_FRAUD'
}

export interface SubmissionResponse {
  id: string;
  documentType: DocumentType;
  status: SubmissionStatus;
  rejectionReason?: RejectionReason;
  createdAt: string;
}

export interface AnalystSubmissionResponse extends SubmissionResponse {
  userId: number;
  username: string;
  extractedData: any;
  fraudScore: number;
}
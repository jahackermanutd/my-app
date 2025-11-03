export type LetterStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Signed";

export type WorkflowStepStatus = "Pending" | "Approved" | "Rejected";

export interface TemplateField {
  key: string;
  label: string;
  required?: boolean;
  description?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  body: string;
  fields: TemplateField[];
  locale: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  level: number;
  approverName: string;
  approverEmail: string;
  approverRole: string;
  status: WorkflowStepStatus;
  actedAt?: string;
  comments?: string;
}

export interface LetterHistoryEvent {
  id: string;
  action:
    | "Created"
    | "Submitted"
    | "Approved"
    | "Rejected"
    | "Signed"
    | "Updated";
  actor: string;
  note?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface LetterRecipient {
  id: string;
  name: string;
  email: string;
  organization?: string;
  department?: string;
  deliveryMethod?: "Email" | "Postal" | "Internal";
  status?: "Pending" | "Sent" | "Received";
  responseDue?: string;
}

export interface LetterSignature {
  id: string;
  signedBy: string;
  signedByTitle?: string;
  signedAt: string;
  verificationLink: string;
  qrDataUrl: string;
  checksum: string;
  note?: string;
}

export interface Letter {
  id: string;
  reference: string;
  subject: string;
  department: string;
  templateId: string;
  templateName: string;
  body: string;
  mergeValues: Record<string, string>;
  status: LetterStatus;
  priority: "Low" | "Normal" | "High";
  isConfidential: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  approvedAt?: string;
  signedAt?: string;
  workflow: WorkflowStep[];
  currentStepIndex: number;
  history: LetterHistoryEvent[];
  recipients: LetterRecipient[];
  tags: string[];
  signature?: LetterSignature;
}

export interface DashboardMetrics {
  totalLetters: number;
  byStatus: Record<LetterStatus, number>;
  pendingApprovals: number;
  averageApprovalTimeHours: number;
  highPriorityCount: number;
  confidentialCount: number;
  signedToday: number;
}

import type {
  DashboardMetrics,
  Letter,
  LetterHistoryEvent,
  LetterStatus,
} from "./types";

export const LETTER_STATUSES: LetterStatus[] = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Signed",
];

export const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
};

export const isoNow = () => new Date().toISOString();

export const extractMergeFields = (body: string) => {
  const regex = /\{\{\s*([\w.]+)\s*\}\}/g;
  const fields = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    fields.add(match[1]);
  }
  return Array.from(fields);
};

export const applyMergeValues = (
  body: string,
  values: Record<string, string>,
): string => {
  return body.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => values[key] ?? "");
};

export const generateReferenceNumber = (sequence: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `ELMS-${year}${month}-${String(sequence).padStart(4, "0")}`;
};

export const createHistoryEvent = (
  action: LetterHistoryEvent["action"],
  actor: string,
  note?: string,
  metadata?: Record<string, unknown>,
): LetterHistoryEvent => ({
  id: createId(),
  action,
  actor,
  note,
  metadata,
  timestamp: isoNow(),
});

export const calculateMetrics = (letters: Letter[]): DashboardMetrics => {
  const byStatus: DashboardMetrics["byStatus"] = {
    Draft: 0,
    "Pending Approval": 0,
    Approved: 0,
    Rejected: 0,
    Signed: 0,
  };

  let totalApprovalTime = 0;
  let approvalCount = 0;
  let signedToday = 0;

  const today = new Date().toISOString().slice(0, 10);

  letters.forEach((letter) => {
    byStatus[letter.status] += 1;
    if (letter.submittedAt && (letter.approvedAt || letter.signedAt)) {
      const end = letter.signedAt ?? letter.approvedAt!;
      totalApprovalTime +=
        new Date(end).getTime() - new Date(letter.submittedAt).getTime();
      approvalCount += 1;
    }
    if (letter.signature?.signedAt?.slice(0, 10) === today) {
      signedToday += 1;
    }
  });

  return {
    totalLetters: letters.length,
    byStatus,
    pendingApprovals: byStatus["Pending Approval"],
    averageApprovalTimeHours:
      approvalCount === 0
        ? 0
        : Number(
            (totalApprovalTime / approvalCount / (1000 * 60 * 60)).toFixed(1),
          ),
    highPriorityCount: letters.filter((l) => l.priority === "High").length,
    confidentialCount: letters.filter((l) => l.isConfidential).length,
    signedToday,
  };
};

export const formatDateTime = (iso: string | undefined) => {
  if (!iso) return "-";
  const date = new Date(iso);
  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

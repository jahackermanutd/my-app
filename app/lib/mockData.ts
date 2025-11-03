import { applyMergeValues, createHistoryEvent, createId, isoNow } from "./utils";
import type { Letter, LetterTemplate } from "./types";

const now = isoNow();

export const defaultTemplates: LetterTemplate[] = [
  {
    id: createId(),
    name: "Internal Memorandum",
    category: "Internal",
    description:
      "Use for internal announcements, policy updates, and general communication across departments.",
    body: `<h2 class="font-semibold text-lg mb-4">Internal Memorandum</h2>
      <p><strong>To:</strong> {{recipient_name}}, {{recipient_department}}</p>
      <p><strong>From:</strong> {{author_name}}, {{author_department}}</p>
      <p><strong>Date:</strong> {{current_date}}</p>
      <p><strong>Subject:</strong> {{subject_line}}</p>
      <p class="mt-4 whitespace-pre-line">{{message_body}}</p>
      <p class="mt-6">Please contact {{contact_person}} at {{contact_email}} for any clarifications.</p>`,
    fields: [
      { key: "recipient_name", label: "Recipient Name", required: true },
      {
        key: "recipient_department",
        label: "Recipient Department",
      },
      { key: "author_name", label: "Author Name", required: true },
      { key: "author_department", label: "Author Department" },
      { key: "current_date", label: "Date", required: true },
      { key: "subject_line", label: "Subject Line", required: true },
      {
        key: "message_body",
        label: "Message Body",
        required: true,
        description: "Main content of the memo. You can include bullet points.",
      },
      {
        key: "contact_person",
        label: "Contact Person",
      },
      {
        key: "contact_email",
        label: "Contact Email",
      },
    ],
    locale: "en-US",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createId(),
    name: "External Outgoing Letter",
    category: "External",
    description:
      "Formal communication with external organizations, partners, or clients.",
    body: `<h2 class="font-semibold text-lg mb-3">Official Letter</h2>
      <p><strong>Recipient:</strong> {{recipient_name}} ({{recipient_company}})</p>
      <p><strong>Addressed On:</strong> {{current_date}}</p>
      <p><strong>Reference:</strong> {{reference_number}}</p>
      <p><strong>Subject:</strong> {{subject_line}}</p>
      <p class="mt-4 whitespace-pre-line">{{message_body}}</p>
      <p class="mt-6">Sincerely,</p>
      <p>{{author_name}}<br/>{{author_title}}<br/>{{author_department}}</p>`,
    fields: [
      { key: "recipient_name", label: "Recipient Name", required: true },
      { key: "recipient_company", label: "Recipient Company" },
      { key: "current_date", label: "Date", required: true },
      { key: "reference_number", label: "Reference Number", required: true },
      { key: "subject_line", label: "Subject Line", required: true },
      {
        key: "message_body",
        label: "Message Body",
        required: true,
      },
      { key: "author_name", label: "Author Name", required: true },
      { key: "author_title", label: "Author Title" },
      { key: "author_department", label: "Author Department" },
    ],
    locale: "en-US",
    createdAt: now,
    updatedAt: now,
  },
];

const sampleTemplate = defaultTemplates[0];

const sampleMergeValues = {
  recipient_name: "Jordan Smith",
  recipient_department: "Operations",
  author_name: "Casey Lee",
  author_department: "Corporate Communications",
  current_date: new Date().toLocaleDateString(),
  subject_line: "Updated Remote Work Policy",
  message_body:
    "Dear team,\n\nWe are updating our remote work guidelines effective next month. Key changes include:\n- New eligibility criteria.\n- Revised equipment reimbursement policy.\n- Mandatory quarterly office days.\n\nPlease review the attached policy document and acknowledge receipt by Friday.\n\nRegards,\nCasey",
  contact_person: "People Operations Desk",
  contact_email: "peopleops@example.org",
};

const submittedAt = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
const approvedAt = new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString();
const signedAt = new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString();

export const defaultLetters: Letter[] = [
  {
    id: createId(),
    reference: "ELMS-202510-0001",
    subject: "Updated Remote Work Policy",
    department: "Corporate Communications",
    templateId: sampleTemplate.id,
    templateName: sampleTemplate.name,
    body: applyMergeValues(sampleTemplate.body, sampleMergeValues),
    mergeValues: sampleMergeValues,
    status: "Signed",
    priority: "High",
    isConfidential: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: signedAt,
    submittedAt,
    approvedAt,
    signedAt,
    workflow: [
      {
        id: createId(),
        level: 1,
        approverName: "Alex Morgan",
        approverEmail: "alex.morgan@example.org",
        approverRole: "Department Head",
        status: "Approved",
        actedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        comments: "Looks good.",
      },
      {
        id: createId(),
        level: 2,
        approverName: "Taylor Brooks",
        approverEmail: "taylor.brooks@example.org",
        approverRole: "HR Director",
        status: "Approved",
        actedAt: approvedAt,
        comments: "Approved with no changes.",
      },
    ],
    currentStepIndex: 2,
    history: [
      createHistoryEvent("Created", "Casey Lee"),
      {
        ...createHistoryEvent("Submitted", "Casey Lee"),
        timestamp: submittedAt,
      },
      {
        ...createHistoryEvent("Approved", "Alex Morgan", "Level 1 approval"),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
      {
        ...createHistoryEvent("Approved", "Taylor Brooks", "Final approval"),
        timestamp: approvedAt,
      },
      {
        ...createHistoryEvent("Signed", "Taylor Brooks", "Digitally signed"),
        timestamp: signedAt,
      },
    ],
    recipients: [
      {
        id: createId(),
        name: "Jordan Smith",
        email: "jordan.smith@example.org",
        department: "Operations",
        deliveryMethod: "Email",
        status: "Sent",
      },
    ],
    tags: ["Policy", "HR"],
    signature: {
      id: createId(),
      signedBy: "Taylor Brooks",
      signedByTitle: "HR Director",
      signedAt,
      verificationLink: "https://verify.example.org/letters/ELMS-202510-0001",
      qrDataUrl: "",
      checksum: "sample-checksum",
      note: "Signature verified via ELMS.",
    },
  },
];

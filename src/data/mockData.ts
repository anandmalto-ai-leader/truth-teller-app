import { Document, SystemRecord, DemoScenario } from '@/types';

export const demoScenarios: DemoScenario[] = [
  {
    id: 'subscription',
    name: 'Subscription Plan (Acme Corp)',
    question: 'What plan is Acme Corp on?',
    icon: '📋',
  },
  {
    id: 'invoice',
    name: 'Invoice Payment (INV-7782)',
    question: 'Has invoice INV-7782 been paid?',
    icon: '💳',
  },
  {
    id: 'appointment',
    name: 'Appointment Time (Patient p_9821)',
    question: 'What time is patient p_9821\'s appointment?',
    icon: '📅',
  },
];

export const initialDocuments: Document[] = [
  // Subscription scenario docs - multiple docs with varying dates to show staleness
  {
    id: 'doc_1',
    scenarioId: 'subscription',
    title: 'Trial Email',
    date: '2025-12-01',
    content: 'Acme Corp is on an Enterprise trial until 2025-12-10.',
    chunks: [
      'Acme Corp is on an Enterprise trial until 2025-12-10.',
    ],
    embedding: [0.82, 0.45, 0.31, 0.67, 0.55],
  },
  {
    id: 'doc_2',
    scenarioId: 'subscription',
    title: 'CS Note',
    date: '2025-12-15',
    content: 'Customer considering downgrade to Pro in January. They mentioned budget constraints.',
    chunks: [
      'Customer considering downgrade to Pro in January.',
      'They mentioned budget constraints.',
    ],
    embedding: [0.78, 0.52, 0.29, 0.71, 0.48],
  },
  {
    id: 'doc_3',
    scenarioId: 'subscription',
    title: 'Pricing Overview',
    date: '2025-11-10',
    content: 'Enterprise includes SSO, advanced analytics, and priority support. Pro is $99/mo.',
    chunks: [
      'Enterprise includes SSO, advanced analytics, and priority support.',
      'Pro is $99/mo.',
    ],
    embedding: [0.65, 0.38, 0.44, 0.59, 0.72],
  },
  {
    id: 'doc_8',
    scenarioId: 'subscription',
    title: 'Upgrade Confirmation',
    date: '2025-12-20',
    content: 'Trial ended. Acme Corp upgraded but specific plan not mentioned in this email thread.',
    chunks: [
      'Trial ended.',
      'Acme Corp upgraded but specific plan not mentioned in this email thread.',
    ],
    embedding: [0.80, 0.48, 0.33, 0.69, 0.51],
  },
  
  // Invoice scenario docs - show timing mismatch
  {
    id: 'doc_4',
    scenarioId: 'invoice',
    title: 'Payment Reminder',
    date: '2025-12-25',
    content: 'Invoice INV-7782 is pending. Please remit payment by Dec 31.',
    chunks: [
      'Invoice INV-7782 is pending.',
      'Please remit payment by Dec 31.',
    ],
    embedding: [0.71, 0.62, 0.48, 0.35, 0.58],
  },
  {
    id: 'doc_5',
    scenarioId: 'invoice',
    title: 'Invoice PDF Summary',
    date: '2025-12-20',
    content: 'Invoice INV-7782. Amount due: $1249. Status: Awaiting payment.',
    chunks: [
      'Invoice INV-7782.',
      'Amount due: $1249.',
      'Status: Awaiting payment.',
    ],
    embedding: [0.73, 0.58, 0.51, 0.32, 0.61],
  },
  {
    id: 'doc_9',
    scenarioId: 'invoice',
    title: 'AR Team Note',
    date: '2025-12-26',
    content: 'Customer promised payment this week for INV-7782. Following up Monday.',
    chunks: [
      'Customer promised payment this week for INV-7782.',
      'Following up Monday.',
    ],
    embedding: [0.69, 0.64, 0.45, 0.38, 0.55],
  },
  
  // Appointment scenario docs - show outdated info
  {
    id: 'doc_6',
    scenarioId: 'appointment',
    title: 'Confirmation Email',
    date: '2025-12-01',
    content: 'Your appointment is confirmed for 10:00 AM on Dec 27, 2025 with Dr. Smith.',
    chunks: [
      'Your appointment is confirmed for 10:00 AM on Dec 27, 2025.',
      'with Dr. Smith.',
    ],
    embedding: [0.55, 0.72, 0.61, 0.48, 0.39],
  },
  {
    id: 'doc_7',
    scenarioId: 'appointment',
    title: 'Reschedule Request',
    date: '2025-12-24',
    content: 'Patient requested afternoon slot. Checking availability.',
    chunks: [
      'Patient requested afternoon slot.',
      'Checking availability.',
    ],
    embedding: [0.52, 0.75, 0.58, 0.51, 0.42],
  },
  {
    id: 'doc_10',
    scenarioId: 'appointment',
    title: 'Reschedule Confirmation',
    date: '2025-12-26',
    content: 'Appointment moved to afternoon per patient request. New time TBD.',
    chunks: [
      'Appointment moved to afternoon per patient request.',
      'New time TBD.',
    ],
    embedding: [0.53, 0.78, 0.55, 0.53, 0.40],
  },
];

export const initialSystemRecords: SystemRecord[] = [
  {
    id: 'rec_1',
    scenarioId: 'subscription',
    data: {
      account_id: 'acme_123',
      company: 'Acme Corp',
      plan: 'Pro',
      status: 'Active',
      billing_cycle: 'Monthly',
    },
    source: 'Billing API',
    last_updated: '2025-12-26T10:14:00Z',
  },
  {
    id: 'rec_2',
    scenarioId: 'invoice',
    data: {
      invoice_id: 'INV-7782',
      amount: 1249.00,
      currency: 'USD',
      status: 'Paid',
      paid_at: '2025-12-27T09:48:21Z',
    },
    source: 'Billing API',
    last_updated: '2025-12-27T09:48:21Z',
  },
  {
    id: 'rec_3',
    scenarioId: 'appointment',
    data: {
      patient_id: 'p_9821',
      appointment_id: 'apt_551',
      date: '2025-12-27',
      time: '15:30',
      timezone: 'America/Chicago',
      provider: 'Dr. Smith',
    },
    source: 'Calendar API',
    last_updated: '2025-12-26T18:02:00Z',
  },
];

// Deterministic answers from system of record
export const deterministicAnswers: Record<string, string> = {
  subscription: 'Acme Corp is on the Pro plan with Active status, billed Monthly.',
  invoice: 'Invoice INV-7782 has been Paid. Payment received on Dec 27, 2025 at 9:48 AM UTC.',
  appointment: 'Patient p_9821\'s appointment is scheduled for 3:30 PM (15:30) on Dec 27, 2025 with Dr. Smith.',
};

// Failure mode explanations
export const failureModeExplanations: Record<string, { title: string; description: string }> = {
  stale_docs: {
    title: 'Stale Documents',
    description: 'RAG retrieved documents that were created before the most recent system update. The text was accurate when written, but the state has since changed.',
  },
  missing_context: {
    title: 'Missing Context',
    description: 'The retrieved documents don\'t contain enough specific information to answer accurately. Key details were not captured in the document corpus.',
  },
  conflicting_sources: {
    title: 'Conflicting Sources',
    description: 'Multiple documents contain different information about the same entity. RAG cannot determine which source is most current.',
  },
  correct: {
    title: 'Correct Answer',
    description: 'In this case, the documents happened to contain current information that matches the system of record.',
  },
};

// Conflict detection
export const conflicts: Record<string, { hasConflict: boolean; reason: string }> = {
  subscription: {
    hasConflict: true,
    reason: 'RAG suggests Enterprise trial, but System of Record shows Pro plan.',
  },
  invoice: {
    hasConflict: true,
    reason: 'RAG says invoice is pending, but System of Record shows it\'s been paid.',
  },
  appointment: {
    hasConflict: true,
    reason: 'RAG mentions 10:00 AM or "afternoon", but System of Record shows exact time: 3:30 PM.',
  },
};

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
  // Subscription scenario docs
  {
    id: 'doc_1',
    scenarioId: 'subscription',
    title: 'Trial Email',
    date: '2025-12-01',
    content: 'Acme Corp is on an Enterprise trial until 2025-12-10.',
  },
  {
    id: 'doc_2',
    scenarioId: 'subscription',
    title: 'CS Note',
    date: '2025-12-15',
    content: 'Customer considering downgrade to Pro in January.',
  },
  {
    id: 'doc_3',
    scenarioId: 'subscription',
    title: 'Pricing Overview',
    date: '2025-11-10',
    content: 'Enterprise includes SSO, advanced analytics...',
  },
  // Invoice scenario docs
  {
    id: 'doc_4',
    scenarioId: 'invoice',
    title: 'Payment Reminder',
    date: '2025-12-27',
    content: 'Invoice INV-7782 is pending.',
  },
  {
    id: 'doc_5',
    scenarioId: 'invoice',
    title: 'Invoice PDF Summary',
    date: '2025-12-20',
    content: 'Amount due: $1249.',
  },
  // Appointment scenario docs
  {
    id: 'doc_6',
    scenarioId: 'appointment',
    title: 'Confirmation Email',
    date: '2025-12-01',
    content: 'Appointment at 10:00 AM.',
  },
  {
    id: 'doc_7',
    scenarioId: 'appointment',
    title: 'Reschedule Note',
    date: '2025-12-26',
    content: 'Moved to afternoon.',
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

// Simulated RAG answers (based on outdated docs)
export const ragAnswers: Record<string, { answer: string; confidence: number }> = {
  subscription: {
    answer: 'Based on the documents, Acme Corp appears to be on an Enterprise trial (mentioned in Trial Email from Dec 1), though there\'s a note about possibly downgrading to Pro in January.',
    confidence: 0.72,
  },
  invoice: {
    answer: 'According to the Payment Reminder from Dec 27, invoice INV-7782 is pending. The amount due is $1249.',
    confidence: 0.85,
  },
  appointment: {
    answer: 'The appointment was originally scheduled for 10:00 AM (per Confirmation Email), but a Reschedule Note from Dec 26 indicates it was moved to the afternoon.',
    confidence: 0.68,
  },
};

// Deterministic answers from system of record
export const deterministicAnswers: Record<string, string> = {
  subscription: 'Acme Corp is on the Pro plan with Active status, billed Monthly.',
  invoice: 'Invoice INV-7782 has been Paid. Payment received on Dec 27, 2025 at 9:48 AM UTC.',
  appointment: 'Patient p_9821\'s appointment is scheduled for 3:30 PM (15:30) on Dec 27, 2025 with Dr. Smith.',
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

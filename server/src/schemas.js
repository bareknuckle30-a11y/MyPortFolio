import { z } from 'zod';

export const SERVICE_LABELS = {
  portfolios: 'Personal Portfolio / Resume Website',
  'business-websites': 'Business Website / Landing Page',
  'task-management': 'Task Management Application',
  'chat-apps': 'Personal or Team Chat Application',
  edtech: 'EdTech / Learning Platform',
  ecommerce: 'Online Store / E-commerce Website',
  'custom-solutions': 'Custom Dashboard / Business Application',
  'data-pipelines': 'Data & Automation Solution',
  other: 'Something else',
};

export const BUDGETS = ['not-sure', 'under-1k', '1k-3k', '3k-10k', '10k-plus']; // [PLACEHOLDER] adjust ranges and currency
export const BUDGET_LABELS = {
  'not-sure': 'Not sure yet',
  'under-1k': 'Under 1k',
  '1k-3k': '1k to 3k',
  '3k-10k': '3k to 10k',
  '10k-plus': '10k+',
};

const clean = (s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();

export const contactSchema = z.object({
  name: z.string().transform(clean).pipe(z.string().min(1, 'Enter your name').max(120)),
  email: z.string().transform((s) => s.trim().toLowerCase()).pipe(z.string().email('Enter a valid email').max(254)),
  service: z.enum(Object.keys(SERVICE_LABELS), { errorMap: () => ({ message: 'Choose a service' }) }),
  budget: z.enum(BUDGETS).optional(),
  message: z.string().transform(clean).pipe(z.string().min(10, 'Tell us a little more (10 characters minimum)').max(5000)),
  // Honeypot: real visitors never see or fill this field.
  hp: z.string().max(200).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().transform((s) => s.trim().toLowerCase()).pipe(z.string().email('Enter a valid email').max(254)),
  hp: z.string().max(200).optional(),
});

export const slugSchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(100);
export const tokenSchema = z.string().regex(/^[a-f0-9]{48}$/);

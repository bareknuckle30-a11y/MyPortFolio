import { z } from 'zod';

// Keep in sync with server/src/schemas.js. The server is the source of truth: it validates again.
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(120, 'Keep your name under 120 characters'),
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address').max(254),
  service: z.string().min(1, 'Choose a service'),
  budget: z.string().optional(),
  message: z.string().trim().min(10, 'Tell us a little more (10 characters minimum)').max(5000, 'Please keep it under 5000 characters'),
  hp: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email').email('Enter a valid email address').max(254),
  hp: z.string().optional(),
});

/** Turn a zod error into { field: message } using the first message per field. */
export function fieldErrors(error) {
  const out = {};
  for (const issue of error.issues) {
    const key = issue.path[0] ?? '_';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../lib/supabase.js';
import { sendEmail, addToList } from '../lib/brevo.js';
import { ownerNotification, visitorReply } from '../emails/templates.js';
import { contactSchema } from '../schemas.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errors.js';
import { logger } from '../lib/logger.js';
import { config } from '../config.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many messages. Please try again in a few minutes.' } },
});

router.post('/', limiter, validate(contactSchema), async (req, res, next) => {
  try {
    const { hp, ...lead } = req.body;

    // Honeypot filled: pretend success so bots learn nothing, store nothing.
    if (hp) return res.status(201).json({ ok: true });

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({ ...lead, budget: lead.budget ?? null, source: 'website' })
      .select('id')
      .single();

    if (error) {
      logger.error('contact insert failed', { err: error });
      throw new AppError(500, 'save_failed', 'We could not save your message. Please try again.');
    }

    // The lead is saved. Email problems must never turn this into a failure for the visitor.
    if (config.emailEnabled) {
      const owner = ownerNotification(lead);
      const reply = visitorReply(lead);
      const jobs = [
        config.brevo.ownerEmail
          ? sendEmail({ to: [{ email: config.brevo.ownerEmail }], subject: owner.subject, html: owner.html, text: owner.text, replyTo: { email: lead.email, name: lead.name } })
          : Promise.resolve(),
        sendEmail({ to: [{ email: lead.email, name: lead.name }], subject: reply.subject, html: reply.html, text: reply.text, replyTo: config.brevo.ownerEmail ? { email: config.brevo.ownerEmail } : undefined }),
        addToList({ email: lead.email, name: lead.name, listId: config.brevo.leadsList }),
      ];
      const labels = ['owner notification', 'visitor auto-reply', 'brevo list'];
      const results = await Promise.allSettled(jobs);
      results.forEach((r, i) => {
        if (r.status === 'rejected') logger.error(`contact: ${labels[i]} failed`, { leadId: data.id, err: r.reason });
      });
    } else {
      logger.warn('contact: email disabled, lead saved only', { leadId: data.id });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

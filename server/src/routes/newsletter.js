import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../lib/supabase.js';
import { sendEmail, addToList } from '../lib/brevo.js';
import { newsletterConfirm } from '../emails/templates.js';
import { newsletterSchema, tokenSchema } from '../schemas.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../middleware/errors.js';
import { logger } from '../lib/logger.js';
import { config } from '../config.js';

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many attempts. Please try again later.' } },
});

// Same response whether or not the address already exists, so this cannot be used to probe the list.
const GENERIC = { ok: true, message: 'Check your inbox for a confirmation link.' };

router.post('/', limiter, validate(newsletterSchema), async (req, res, next) => {
  try {
    const { email, hp } = req.body;
    if (hp) return res.status(201).json(GENERIC);

    const { data: existing, error: findErr } = await supabase
      .from('newsletter_subscribers')
      .select('id, confirmed, confirm_token')
      .eq('email', email)
      .maybeSingle();
    if (findErr) throw new AppError(500, 'lookup_failed', 'Something went wrong. Please try again.');

    if (existing?.confirmed) return res.status(200).json(GENERIC);

    let token = existing?.confirm_token;
    if (!existing) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email })
        .select('confirm_token')
        .single();
      if (error) {
        logger.error('newsletter insert failed', { err: error });
        throw new AppError(500, 'save_failed', 'Something went wrong. Please try again.');
      }
      token = data.confirm_token;
    }

    if (config.emailEnabled) {
      const url = `${config.serverUrl}/api/newsletter/confirm?token=${token}`;
      const mail = newsletterConfirm(url);
      try {
        await sendEmail({ to: [{ email }], subject: mail.subject, html: mail.html, text: mail.text });
      } catch (err) {
        logger.error('newsletter confirmation email failed', { err });
        throw new AppError(502, 'email_failed', 'We could not send the confirmation email. Please try again.');
      }
    } else {
      logger.warn('newsletter: email disabled, subscriber saved unconfirmed');
    }

    res.status(201).json(GENERIC);
  } catch (err) {
    next(err);
  }
});

// Link in the confirmation email. Redirects back to the site with ?subscribed=1 or 0.
router.get('/confirm', async (req, res) => {
  const back = (ok) => res.redirect(302, `${config.clientUrl}/?subscribed=${ok ? 1 : 0}`);
  try {
    const token = tokenSchema.safeParse(req.query.token);
    if (!token.success) return back(false);

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq('confirm_token', token.data)
      .select('email')
      .maybeSingle();
    if (error || !data) return back(false);

    try {
      await addToList({ email: data.email, listId: config.brevo.newsletterList });
    } catch (err) {
      logger.error('newsletter: brevo list add failed', { err });
    }
    return back(true);
  } catch (err) {
    logger.error('newsletter confirm failed', { err });
    return back(false);
  }
});

export default router;

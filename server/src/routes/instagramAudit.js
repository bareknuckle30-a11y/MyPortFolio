
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { addToList, sendEmail } from '../lib/brevo.js';
import { config } from '../config.js';
import { logger } from '../lib/logger.js';
import { AppError } from '../middleware/errors.js';

const router = Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { code: 'rate_limited', message: 'Too many audit requests. Please try again later.' } },
});

const schema = z.object({
  instagramUrl: z.string().trim().url().max(500).refine((value) => {
    try {
      const u = new URL(value);
      return ['instagram.com', 'www.instagram.com'].includes(u.hostname.toLowerCase()) &&
        /^\/[a-zA-Z0-9._]{1,30}\/?$/.test(u.pathname);
    } catch { return false; }
  }, 'Enter a valid Instagram profile URL'),
  businessType: z.enum(['creator','local-business','professional-service','ecommerce','other']),
  primaryGoal: z.enum(['grow-audience','get-leads','sell-products','build-credibility','portfolio']),
  postingFrequency: z.enum(['daily','few-week','weekly','rarely','unknown']),
  hasWebsite: z.enum(['yes','no','planning']),
  bioClarity: z.enum(['clear','somewhat','unclear','unsure']),
  contentChallenge: z.enum(['consistency','ideas','design','reach','conversions','not-sure']),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  businessName: z.string().trim().max(160).optional().default(''),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please agree to be contacted about this audit.' }) }),
  hp: z.string().max(200).optional(),
});

function makeReport(input) {
  let score = 50;
  const findings = [];
  const actions = [];
  if (input.bioClarity === 'clear') { score += 15; findings.push('You report that your bio clearly explains what you offer.'); }
  else if (input.bioClarity === 'somewhat') { score += 7; findings.push('Your bio may communicate the offer, but the message could be sharper.'); actions.push('Rewrite the bio around audience, outcome and one clear next step.'); }
  else { findings.push('Your bio clarity is uncertain or needs work.'); actions.push('Clarify who you help, what you offer and how people should contact you.'); }
  if (input.postingFrequency === 'daily') score += 15;
  else if (input.postingFrequency === 'few-week') score += 12;
  else if (input.postingFrequency === 'weekly') score += 7;
  else { findings.push('Your posting rhythm may be too irregular to build a predictable content habit.'); actions.push('Set a realistic weekly publishing schedule and repeat a few content pillars.'); }
  if (input.hasWebsite === 'yes') score += 10;
  else { findings.push('Your Instagram presence may be doing too much of the work without a dedicated website destination.'); actions.push('Create a focused website or landing page that turns profile visits into enquiries or sales.'); }
  if (input.contentChallenge === 'consistency' || input.contentChallenge === 'ideas') actions.push('Build a repeatable content plan with recurring themes and clear post objectives.');
  if (input.contentChallenge === 'design') actions.push('Create a consistent visual system for post covers, typography and brand colours.');
  if (input.contentChallenge === 'reach') actions.push('Review content hooks, audience relevance and distribution before increasing posting volume.');
  if (input.contentChallenge === 'conversions') actions.push('Use clearer calls to action and a single next step for each campaign.');
  if (input.primaryGoal === 'sell-products' && input.businessType === 'ecommerce') actions.push('Make the path from product discovery to catalogue, enquiry or checkout easy to follow.');
  if (input.primaryGoal === 'get-leads') actions.push('Give visitors a clear enquiry destination and a short, low-friction contact journey.');
  if (input.primaryGoal === 'build-credibility') actions.push('Add proof: case studies, testimonials, credentials or examples of completed work.');
  score = Math.max(35, Math.min(96, score));

  let service = { slug: 'business-websites', name: 'Business Website / Landing Page', reason: 'A focused destination can turn profile interest into enquiries and explain your offer in more detail.' };
  if (input.businessType === 'creator' || input.primaryGoal === 'portfolio') {
    service = { slug: 'portfolios', name: 'Personalized Portfolio', reason: 'A portfolio can organise your work, show proof and give potential clients a stronger reason to contact you.' };
  } else if (input.businessType === 'ecommerce' || input.primaryGoal === 'sell-products') {
    service = { slug: 'ecommerce', name: 'E-commerce Website', reason: 'A product-focused website can give visitors a clearer catalogue and a structured route to enquire or buy.' };
  } else if (input.hasWebsite === 'yes' && (input.primaryGoal === 'get-leads' || input.contentChallenge === 'conversions')) {
    service = { slug: 'custom-solutions', name: 'Custom Business Application', reason: 'If your current website exists but lead handling is fragmented, a tailored enquiry or reporting workflow may help. A discovery call is needed to confirm fit.' };
  }

  const uniqueActions = [...new Set(actions)].slice(0, 5);
  if (!uniqueActions.length) uniqueActions.push('Keep your publishing rhythm consistent and review which content leads to meaningful profile actions.');
  return {
    score,
    scoreLabel: score >= 80 ? 'Strong starting point' : score >= 65 ? 'Room to improve' : 'Needs a clearer system',
    findings,
    actions: uniqueActions,
    recommendedService: service,
    basis: 'This preliminary report is based on the answers you submitted. It does not fetch or verify Instagram analytics, reach, saves, audience demographics or private account data.',
  };
}

router.post('/', limiter, async (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const fields = {};
      for (const issue of parsed.error.issues) fields[issue.path.join('.') || '_'] ||= issue.message;
      return res.status(400).json({ error: { code: 'validation_error', message: 'Please check the highlighted fields.', fields } });
    }
    const { hp, ...lead } = parsed.data;
    if (hp) return res.status(201).json({ ok: true, report: null });
    const report = makeReport(lead);
    const { data, error } = await supabase.from('instagram_audits').insert({
      instagram_url: lead.instagramUrl,
      business_type: lead.businessType,
      primary_goal: lead.primaryGoal,
      posting_frequency: lead.postingFrequency,
      has_website: lead.hasWebsite,
      bio_clarity: lead.bioClarity,
      content_challenge: lead.contentChallenge,
      name: lead.name,
      email: lead.email,
      business_name: lead.businessName || null,
      recommended_service: report.recommendedService.slug,
      score: report.score,
      report,
      consent: lead.consent,
      source: 'instagram-audit',
    }).select('id').single();
    if (error) {
      logger.error('instagram audit insert failed', { err: error });
      throw new AppError(500, 'save_failed', 'We could not save your audit. Please try again.');
    }

    if (config.emailEnabled) {
      const jobs = [
        config.brevo.ownerEmail ? sendEmail({
          to: [{ email: config.brevo.ownerEmail }],
          subject: `Instagram audit lead: ${lead.name}`,
          text: `New Instagram audit lead\nName: ${lead.name}\nEmail: ${lead.email}\nBusiness: ${lead.businessName || 'Not provided'}\nInstagram: ${lead.instagramUrl}\nRecommended service: ${report.recommendedService.name}\nScore: ${report.score}/100\n`,
          html: `<p>New Instagram audit lead</p><p><b>${lead.name}</b> · ${lead.email}</p><p>${lead.instagramUrl}</p><p>Recommended: ${report.recommendedService.name}</p><p>Score: ${report.score}/100</p>`,
          replyTo: { email: lead.email, name: lead.name },
        }) : Promise.resolve(),
        addToList({ email: lead.email, name: lead.name, listId: config.brevo.leadsList }),
      ];
      const results = await Promise.allSettled(jobs);
      results.forEach((r) => { if (r.status === 'rejected') logger.error('instagram audit notification failed', { auditId: data.id, err: r.reason }); });
    }
    res.status(201).json({ ok: true, auditId: data.id, report });
  } catch (err) { next(err); }
});

export default router;

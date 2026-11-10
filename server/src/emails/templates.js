import { SERVICE_LABELS, BUDGET_LABELS } from '../schemas.js';
import { config } from '../config.js';

const C = { bg: '#0b0a0f', panel: '#14121b', ink: '#f2f0f7', muted: '#9b96ab', line: '#2a2638', purple: '#8a2be2', light: '#b36bff' };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px"><tr><td style="background:${C.purple};border-radius:999px">
    <a href="${esc(href)}" style="display:inline-block;padding:13px 26px;font:600 15px ${FONT};color:#ffffff;text-decoration:none">${esc(label)}</a>
  </td></tr></table>`;
}

function layout({ preheader, title, body, footerNote }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};color:${C.ink};font-family:${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}"><tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
    <tr><td style="padding:0 4px 18px;font:700 20px ${FONT};letter-spacing:.04em;color:${C.ink}">WEBHEAD<span style="color:${C.light}">.</span></td></tr>
    <tr><td style="background:${C.panel};border:1px solid ${C.line};border-radius:16px;padding:28px 26px">${body}</td></tr>
    <tr><td style="padding:18px 4px 0;font:12px/1.6 ${FONT};color:${C.muted}">${footerNote}<br>Webhead Solutions · Digital products for people and growing businesses</td></tr>
  </table>
</td></tr></table></body></html>`;
}

const h = (t) => `<h1 style="margin:0 0 14px;font:700 22px/1.25 ${FONT};color:${C.ink}">${esc(t)}</h1>`;
const p = (t) => `<p style="margin:0 0 14px;font:15px/1.6 ${FONT};color:${C.ink}">${t}</p>`;
const row = (k, v) => `<tr><td style="padding:8px 14px 8px 0;font:12px ${FONT};letter-spacing:.08em;text-transform:uppercase;color:${C.muted};vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font:15px/1.5 ${FONT};color:${C.ink};vertical-align:top">${v}</td></tr>`;

export function ownerNotification(lead) {
  const service = SERVICE_LABELS[lead.service] || lead.service;
  const budget = lead.budget ? BUDGET_LABELS[lead.budget] || lead.budget : 'Not given';
  const subject = `New enquiry: ${service} from ${lead.name}`;
  const body =
    h('New enquiry from the website') +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.line};margin-bottom:8px">
      ${row('Name', esc(lead.name))}
      ${row('Email', `<a href="mailto:${esc(lead.email)}" style="color:${C.light}">${esc(lead.email)}</a>`)}
      ${row('Service', esc(service))}
      ${row('Budget', esc(budget))}
      ${row('Message', esc(lead.message).replace(/\n/g, '<br>'))}
    </table>` +
    button(`mailto:${lead.email}?subject=${encodeURIComponent('Re: your enquiry about ' + service)}`, 'Reply to ' + lead.name.split(' ')[0]);
  return {
    subject,
    html: layout({ preheader: `${lead.name} asked about ${service}`, title: subject, body, footerNote: 'Saved to your contact_submissions table.' }),
    text: `New enquiry from the website\n\nName: ${lead.name}\nEmail: ${lead.email}\nService: ${service}\nBudget: ${budget}\n\nMessage:\n${lead.message}\n`,
  };
}

export function visitorReply(lead) {
  const service = SERVICE_LABELS[lead.service] || lead.service;
  const first = lead.name.split(' ')[0];
  const subject = 'Thanks, we got your message';
  const body =
    h(`Thanks, ${first}`) +
    p(`We received your enquiry about <strong>${esc(service)}</strong>. A real person will read it and reply within ${esc(config.responseTime)}.`) +
    p('Here is what you sent, so you have a copy:') +
    `<div style="margin:0 0 6px;padding:14px 16px;border:1px solid ${C.line};border-radius:10px;background:${C.bg};font:14px/1.6 ${FONT};color:${C.muted}">${esc(lead.message).replace(/\n/g, '<br>')}</div>` +
    p(`If you need to add something, just reply to this email.`);
  return {
    subject,
    html: layout({ preheader: `We will reply within ${config.responseTime}.`, title: subject, body, footerNote: 'You are receiving this because you used the contact form on our website.' }),
    text: `Thanks, ${first}\n\nWe received your enquiry about ${service}. We will reply within ${config.responseTime}.\n\nWhat you sent:\n${lead.message}\n\nIf you need to add something, just reply to this email.\n`,
  };
}

export function newsletterConfirm(confirmUrl) {
  const subject = 'Confirm your subscription';
  const body =
    h('One click to confirm') +
    p('Someone (hopefully you) asked to get updates from Webhead Solutions. Confirm to start receiving them.') +
    button(confirmUrl, 'Confirm subscription') +
    p(`<span style="color:${C.muted};font-size:13px">If the button does not work, paste this link into your browser:<br>${esc(confirmUrl)}</span>`);
  return {
    subject,
    html: layout({ preheader: 'Confirm your subscription to Webhead Solutions.', title: subject, body, footerNote: 'If you did not request this, ignore this email and nothing will happen.' }),
    text: `Confirm your subscription to Webhead Solutions:\n${confirmUrl}\n\nIf you did not request this, ignore this email.\n`,
  };
}

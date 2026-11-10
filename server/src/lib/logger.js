// Small structured logger: one JSON object per line, easy to search in any host's log viewer.
const SECRET_KEYS = /key|token|password|authorization|secret/i;

function clean(meta) {
  if (!meta || typeof meta !== 'object') return meta;
  const out = {};
  for (const [k, v] of Object.entries(meta)) {
    if (SECRET_KEYS.test(k)) out[k] = '[redacted]';
    else if (v instanceof Error) out[k] = { name: v.name, message: v.message };
    else out[k] = v;
  }
  return out;
}

function write(level, msg, meta) {
  const line = JSON.stringify({ time: new Date().toISOString(), level, msg, ...clean(meta) });
  (level === 'error' ? console.error : console.log)(line);
}

export const logger = {
  info: (msg, meta) => write('info', msg, meta),
  warn: (msg, meta) => write('warn', msg, meta),
  error: (msg, meta) => write('error', msg, meta),
};

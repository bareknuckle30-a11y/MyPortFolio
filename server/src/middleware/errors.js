import { logger } from '../lib/logger.js';
import { config } from '../config.js';

export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function notFound(_req, res) {
  res.status(404).json({ error: { code: 'not_found', message: 'Not found' } });
}

// Express recognises error handlers by their four arguments.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: { code: 'too_large', message: 'Request is too large' } });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { code: 'bad_json', message: 'Request body is not valid JSON' } });
  }
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: { code: err.code, message: err.message } });
  }
  if (err.message === 'Origin not allowed') {
    return res.status(403).json({ error: { code: 'cors', message: 'Origin not allowed' } });
  }
  logger.error('unhandled error', { path: req.path, method: req.method, err });
  // Never leak stack traces or internals in production responses.
  const message = config.isProd ? 'Something went wrong' : err.message;
  res.status(500).json({ error: { code: 'internal_error', message } });
}

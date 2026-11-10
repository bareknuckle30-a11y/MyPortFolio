import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { notFound, errorHandler } from './middleware/errors.js';
import contactRoutes from './routes/contact.js';
import newsletterRoutes from './routes/newsletter.js';
import projectRoutes from './routes/projects.js';
import healthRoutes from './routes/health.js';

export function createApp() {
  const app = express();

  // Behind a proxy on Render/Railway/etc: needed so rate limiting sees the real client IP.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // No Origin header: server-to-server calls, curl, uptime checks, email-link redirects.
        if (!origin || config.clientUrls.includes(origin)) return cb(null, true);
        if (!config.isProd && /^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);
        cb(new Error('Origin not allowed'));
      },
      methods: ['GET', 'POST'],
      maxAge: 600,
    })
  );
  app.use(express.json({ limit: '20kb' }));

  // Request log (method, path, status, time). Bodies are never logged.
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      if (req.path === '/api/health') return;
      logger.info('request', { method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start });
    });
    next();
  });

  // Broad ceiling for the whole API; the contact and newsletter routes add stricter limits.
  app.use(
    '/api',
    rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false })
  );

  app.use('/api/health', healthRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/projects', projectRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

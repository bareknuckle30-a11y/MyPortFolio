
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
import instagramAuditRoutes from './routes/instagramAudit.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(helmet());

  // CORS configuration
  const allowedOrigins = [
    ...config.clientUrls,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];

  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server requests
        if (!origin) {
          return callback(null, true);
        }

        // Allow configured production and local frontend URLs
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin not allowed: ${origin}`));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    })
  );

  app.use(express.json({ limit: '20kb' }));

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      if (req.path === '/api/health') return;

      logger.info('request', {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        ms: Date.now() - start,
      });
    });

    next();
  });

  // API rate limiting
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
    })
  );

  // API routes
  app.use('/api/health', healthRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/newsletter', newsletterRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/instagram-audit', instagramAuditRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

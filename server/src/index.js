import { config } from './config.js';
import { createApp } from './app.js';
import { logger } from './lib/logger.js';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info('server listening', { port: config.port, env: config.env, email: config.emailEnabled ? 'enabled' : 'disabled' });
  if (!config.emailEnabled) logger.warn('Brevo not configured: enquiries are saved but no email is sent');
});

function shutdown(signal) {
  logger.info('shutting down', { signal });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => logger.error('unhandled rejection', { err }));

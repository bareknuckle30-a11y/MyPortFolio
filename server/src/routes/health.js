import { Router } from 'express';
import { config } from '../config.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ ok: true, uptime: Math.round(process.uptime()), email: config.emailEnabled ? 'enabled' : 'disabled' });
});

export default router;

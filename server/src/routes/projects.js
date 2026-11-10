import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { slugSchema } from '../schemas.js';
import { AppError } from '../middleware/errors.js';
import { logger } from '../lib/logger.js';

const router = Router();

const LIST_FIELDS = 'slug, title, summary, services, tags, cover_url, created_at';
const DETAIL_FIELDS = `${LIST_FIELDS}, problem, approach, result`;

router.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(LIST_FIELDS)
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (error) {
      logger.error('projects list failed', { err: error });
      throw new AppError(500, 'load_failed', 'Could not load projects');
    }
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ projects: data });
  } catch (err) {
    next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = slugSchema.safeParse(req.params.slug);
    if (!slug.success) throw new AppError(404, 'not_found', 'Project not found');

    const { data, error } = await supabase
      .from('projects')
      .select(DETAIL_FIELDS)
      .eq('slug', slug.data)
      .eq('published', true)
      .maybeSingle();
    if (error) {
      logger.error('project load failed', { err: error });
      throw new AppError(500, 'load_failed', 'Could not load project');
    }
    if (!data) throw new AppError(404, 'not_found', 'Project not found');
    res.set('Cache-Control', 'public, max-age=60');
    res.json({ project: data });
  } catch (err) {
    next(err);
  }
});

export default router;

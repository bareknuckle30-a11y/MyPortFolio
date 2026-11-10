import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { FEATURED_PROJECTS } from '../data/featuredProjects.js';

/** Loads published case studies. Falls back to labelled placeholders if the API is unreachable. */
export function useProjects() {
  const [state, setState] = useState({ projects: null, failed: false });

  useEffect(() => {
    const ctl = new AbortController();
    api.listProjects(ctl.signal)
      .then((d) => setState({ projects: [...FEATURED_PROJECTS, ...(d.projects || []).filter((p) => !FEATURED_PROJECTS.some((f) => f.slug === p.slug))], failed: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ projects: FEATURED_PROJECTS, failed: true });
      });
    return () => ctl.abort();
  }, []);

  return { ...state, loading: state.projects === null };
}

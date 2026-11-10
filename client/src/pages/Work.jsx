import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Seo from '../components/Seo.jsx';
import { WorkCard } from '../components/Cards.jsx';
import ContactBlock from '../components/ContactBlock.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { api, ApiError } from '../lib/api.js';
import { bySlug } from '../data/services.js';
import { featuredBySlug } from '../data/featuredProjects.js';
import ProjectPreview from '../components/ProjectPreview.jsx';

export function WorkIndex() {
  const { projects, loading, failed } = useProjects();
  return (
    <div className="shell">
      <Seo title="Work" description="Selected Webhead projects across personal portfolios, task management, education technology and custom digital products." />
      <section className="page-hero">
        <span className="eyebrow">Work</span>
        <h1>Selected projects.</h1>
        <p className="lead">Problem, approach and result for each one.</p>
      </section>
      <section className="sec" style={{ paddingTop: 28 }}>
        {failed ? <p className="muted" role="status" style={{ marginBottom: 18 }}>Showing featured projects. Additional projects are temporarily unavailable.</p> : null}
        {loading ? <p className="muted" role="status">Loading projects…</p> : projects.length === 0 ? (
          <p className="muted">No projects are published yet. Check back soon.</p>
        ) : (
          <div className="work">{projects.map((p) => <WorkCard key={p.slug || p.title} project={p} />)}</div>
        )}
      </section>
      <ContactBlock />
    </div>
  );
}

export function WorkDetail() {
  const { slug } = useParams();
  const featured = featuredBySlug(slug);
  const [state, setState] = useState({ status: 'loading', project: null, message: '' });
  const [showLive, setShowLive] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    setShowLive(false);
    if (featuredBySlug(slug)) { setState({ status: 'ok', project: featuredBySlug(slug), message: '' }); return () => ctl.abort(); }
    setState({ status: 'loading', project: null, message: '' });
    api.getProject(slug, ctl.signal)
      .then((d) => setState({ status: 'ok', project: d.project, message: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const notFound = err instanceof ApiError && err.status === 404;
        setState({ status: notFound ? 'missing' : 'error', project: null, message: err.message });
      });
    return () => ctl.abort();
  }, [slug]);

  if (state.status === 'loading') {
    return <div className="shell page-hero"><p className="muted" role="status">Loading…</p></div>;
  }
  if (state.status !== 'ok') {
    return (
      <div className="shell page-hero">
        <Seo title="Project not found" noindex />
        <h1>{state.status === 'missing' ? 'Project not found' : 'Could not load this project'}</h1>
        <p className="lead">{state.status === 'missing' ? 'It may have been unpublished or the link is wrong.' : state.message}</p>
        <Link className="btn" to="/work">Back to all work</Link>
      </div>
    );
  }

  const p = state.project;
  return (
    <div className="shell">
      <Seo title={p.title} description={p.summary} />
      <section className="page-hero">
        <p className="crumbs"><Link to="/">Home</Link> / <Link to="/work">Work</Link> / {p.title}</p>
        <h1 style={{ marginTop: 18 }}>{p.title}</h1>
        <p className="lead">{p.summary}</p>
        <div className="chips" style={{ marginTop: 0 }}>
          {(p.services || []).map((s) => <span className="chip hi" key={s}>{bySlug(s)?.long || s}</span>)}
          {(p.tags || []).map((t) => <span className="chip" key={t}>{t}</span>)}
        </div>
      </section>
      <section className="sec" style={{ paddingTop: 36 }}>
        <div className="thumb project-detail-preview" style={{ borderRadius: 16, border: '1px solid var(--line)', marginBottom: 36, aspectRatio: p.preview ? undefined : '21 / 9' }}>
          {p.preview ? <ProjectPreview kind={p.preview} /> : p.cover_url ? <img src={p.cover_url} alt="" /> : <span>{p.title}</span>}
        </div>
        {p.live_url && <div className="project-live-panel">
          <div><h2>Explore the project</h2><p>Open the original website or try the embedded live preview. Some websites block embedding for security reasons.</p></div>
          <div className="project-live-actions"><button className="btn ghost sm" type="button" onClick={() => setShowLive((v) => !v)}>{showLive ? 'Hide live preview' : 'Load live preview'}</button><a className="btn sm" href={p.live_url} target="_blank" rel="noopener noreferrer">Visit live website ↗</a></div>
          {showLive && <div className="project-iframe-wrap"><iframe title={`${p.title} live website preview`} src={p.live_url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-forms allow-scripts allow-same-origin allow-popups" /><p className="muted">If the preview is blank, use “Visit live website” above.</p></div>}
        </div>}
        <div className="case">
          {p.problem ? <div><h2>The problem</h2><p>{p.problem}</p></div> : null}
          {p.approach ? <div><h2>The approach</h2><p>{p.approach}</p></div> : null}
          {p.result ? <div><h2>The result</h2><p>{p.result}</p></div> : null}
        </div>
      </section>
      <ContactBlock />
    </div>
  );
}

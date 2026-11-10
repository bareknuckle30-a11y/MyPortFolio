import { Link } from 'react-router-dom';
import Viz from './Viz.jsx';
import ProjectPreview from './ProjectPreview.jsx';

/** Animated service card. Renders as a link when `to` is given. */
export function ServiceCard({ viz, accent, title, text, points, to }) {
  const body = (
    <>
      <Viz kind={viz} />
      <h3>{title}</h3>
      <p>{text}</p>
      {points?.length ? <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul> : null}
      {to ? <span className="more">Learn more</span> : null}
    </>
  );
  const style = { '--c': accent };
  return to ? (
    <Link to={to} className="card" style={style}>{body}</Link>
  ) : (
    <article className="card hover" style={style}>{body}</article>
  );
}

/** Case-study card. Placeholder entries (no slug) render as a non-link. */
export function WorkCard({ project }) {
  const inner = (
    <>
      <div className="thumb">
        {project.preview ? <ProjectPreview kind={project.preview} /> : project.cover_url ? <img src={project.cover_url} alt="" loading="lazy" /> : <span>{project.title}</span>}
      </div>
      <div className="pbody">
        {project.category && <span className="project-category">{project.category}</span>}
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.preview && <span className="project-discover">Explore case study <span aria-hidden="true">↗</span></span>}
        <div className="chips">{(project.tags || []).map((t) => <span className="chip" key={t}>{t}</span>)}</div>
      </div>
    </>
  );

  return (
    <article className="proj">
      {project.slug ? <Link className="proj-main-link" to={`/work/${project.slug}`} aria-label={`View ${project.title} case study`}>{inner}</Link> : inner}
      {project.live_url && (
        <div className="project-card-host">
          <span className="project-host-label">LIVE PROJECT</span>
          <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label={`Open hosted ${project.title} website in a new tab`}>
            <span className="project-host-icon" aria-hidden="true">↗</span>
            <span className="project-host-address">{project.live_url.replace(/^https?:\/\//, '')}</span>
          </a>
        </div>
      )}
    </article>
  );
}

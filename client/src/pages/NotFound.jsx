import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <div className="shell page-hero" style={{ minHeight: '50vh' }}>
      <Seo title="Page not found" noindex />
      <span className="eyebrow">404</span>
      <h1>This wall is blank.</h1>
      <p className="lead">The page you are looking for does not exist or has moved.</p>
      <div className="row">
        <Link className="btn" to="/">Back to home</Link>
        <Link className="btn ghost" to="/contact">Contact us</Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { NAV, SITE } from '../data/site.js';
import { SERVICES } from '../data/services.js';
import Newsletter from './Newsletter.jsx';

/** Scroll to the hash target (or the top) on navigation. Retries briefly because routes load lazily. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let tries = 0;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      tries++;
      if (el) {
        el.scrollIntoView();
        clearInterval(timer);
      } else if (tries > 20) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [pathname, hash]);
  return null;
}


/** Subtle shared reveal treatment for content blocks on every route. */
function RevealManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const nodes = document.querySelectorAll(
      'main .sec, main .page-hero, main .page-section, main .contact-block, main .pipeline-spot'
    );
    if (!nodes.length) return undefined;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
    nodes.forEach((node) => {
      node.classList.add('reveal-on-scroll');
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

function NavItem({ to, children, onClick, className }) {
  // Hash links stay plain links so the active state only applies to real routes.
  if (to.includes('#')) {
    return <Link to={to} onClick={onClick} className={className}>{children}</Link>;
  }
  return (
    <NavLink to={to} onClick={onClick} className={({ isActive }) => `${className || ''}${isActive ? ' active' : ''}`}>
      {children}
    </NavLink>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="shell">
      <header className="site-bar">
        <Link className="mark" to="/" aria-label="Webhead Solutions home">WEBHEAD<i>.</i></Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => <NavItem key={n.to} to={n.to}>{n.label}</NavItem>)}
        </nav>
        <div className="bar-right">
          <Link className="btn ghost" to="/contact">Let's talk</Link>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
          </button>
        </div>
        <nav id="mobile-nav" className={`drawer${open ? ' open' : ''}`} aria-label="Mobile">
          {NAV.map((n) => <NavItem key={n.to} to={n.to} onClick={() => setOpen(false)}>{n.label}</NavItem>)}
          <Link className="btn" to="/contact" onClick={() => setOpen(false)}>Let's talk</Link>
        </nav>
      </header>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-foot">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <Link className="mark" to="/">WEBHEAD<i>.</i></Link>
            <p>{SITE.tagline}. Personal portfolios, business websites and custom applications, built around real needs.</p>
            <div style={{ marginTop: 18, maxWidth: 380 }}><Newsletter compact /></div>
          </div>
          <div>
            <h4>Services</h4>
            <ul>{SERVICES.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`}>{s.long}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/#solutions">Business solutions</Link></li>
              <li><Link to="/work">Work</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><span className="mono" style={{ overflowWrap: 'anywhere' }}>{SITE.email}</span></li>
              {/* [PLACEHOLDER] Add your social profiles */}
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© {new Date().getFullYear()} Webhead Solutions</span>
          <span>{SITE.tagline}</span>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <ScrollManager />
      <RevealManager />
      <Header />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

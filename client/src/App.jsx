import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// Everything except Home is code-split so the first visit downloads as little as possible.
const Service = lazy(() => import('./pages/Service.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const WorkIndex = lazy(() => import('./pages/Work.jsx').then((m) => ({ default: m.WorkIndex })));
const WorkDetail = lazy(() => import('./pages/Work.jsx').then((m) => ({ default: m.WorkDetail })));
const Privacy = lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Legal.jsx').then((m) => ({ default: m.Terms })));

function Loading() {
  return <div className="shell page-hero" style={{ minHeight: '40vh' }}><p className="muted" role="status">Loading…</p></div>;
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services/:slug" element={<Service />} />
          <Route path="work" element={<WorkIndex />} />
          <Route path="work/:slug" element={<WorkDetail />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

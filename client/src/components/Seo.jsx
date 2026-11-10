import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE } from '../data/site.js';

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/assets/logo-poster.jpg`,
  email: SITE.email,
  slogan: SITE.tagline,
};

/** Per-page title, description, canonical, Open Graph and optional JSON-LD. `ld` can be an object or array. */
export default function Seo({ title, description, ld, noindex = false }) {
  const { pathname } = useLocation();
  const url = SITE.url + (pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
  const full = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
  const image = `${SITE.url}/assets/logo-poster.jpg`;
  const blocks = [orgLd, ...(ld ? (Array.isArray(ld) ? ld : [ld]) : [])];

  return (
    <Helmet>
      <title>{full}</title>
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={full} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={image} />
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(b)}</script>
      ))}
    </Helmet>
  );
}

export function serviceLd(s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.long,
    description: s.short,
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    serviceType: s.long,
  };
}

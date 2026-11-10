import { useEffect, useState } from 'react';
import Seo from '../components/Seo.jsx';
import ContactBlock from '../components/ContactBlock.jsx';

const HEADLINE = 'We Turn Ideas Into Digital Experiences.';

const VALUES = [
  {
    c: '#b36bff',
    t: 'Creativity',
    d: 'We challenge the expected, explore fresh ideas, and give every brand and product a distinct point of view.',
  },
  {
    c: '#f4f2fa',
    t: 'Innovation',
    d: 'We bring design and modern technology together to make digital experiences useful, engaging, and reliable.',
  },
  {
    c: '#ff4fd8',
    t: 'Purpose',
    d: 'We build around real goals and real people, keeping every decision focused on what moves a business forward.',
  },
];

function TypewriterHeadline() {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setTyped(HEADLINE);
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(HEADLINE.slice(0, index));
      if (index >= HEADLINE.length) window.clearInterval(timer);
    }, 58);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <h1 className="about-typewriter" aria-label={HEADLINE}>
      <span aria-hidden="true">{typed}</span>
      <span className="about-typewriter-cursor" aria-hidden="true" />
    </h1>
  );
}

export default function About() {
  return (
    <div className="shell about-page">
      <Seo
        title="About Webhead"
        description="Discover Webhead: a creative digital studio bringing strategy, design and technology together to build distinctive digital experiences."
      />

      <section className="page-hero about-hero">
        <span className="eyebrow">About Webhead</span>
        <TypewriterHeadline />
        <div className="prose about-copy">
          <p className="about-intro">
            We believe great digital experiences happen where bold creativity meets thoughtful technology.
            Webhead brings strategy, design, and development together to help ideas become useful,
            engaging digital products.
          </p>
          <p>
            From websites and portfolios to custom applications, online platforms, and business tools,
            we create digital experiences that help brands communicate clearly, work smarter, and grow
            with confidence.
          </p>
          <p>
            No copy-paste solutions. We take time to understand the people, purpose, and goals behind
            every project, then shape an approach that fits. The result is work with character on the
            surface and solid thinking underneath.
          </p>
        </div>
      </section>

      <section className="sec" aria-labelledby="about-values-title">
        <div className="sec-head">
          <span className="eyebrow">What drives us</span>
          <h2 id="about-values-title">Built on ideas. Driven by impact.</h2>
          <p>Our work is guided by a few principles that keep creativity connected to real outcomes.</p>
        </div>
        <div className="values">
          {VALUES.map((value) => (
            <article className="card" key={value.t} style={{ '--c': value.c }}>
              <h3>{value.t}</h3>
              <p>{value.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sec about-approach" aria-labelledby="about-approach-title">
        <div className="sec-head">
          <span className="eyebrow">Our approach</span>
          <h2 id="about-approach-title">Think it. Design it. Build it.</h2>
        </div>
        <div className="prose">
          <p>
            We start by listening and asking the right questions. Then we turn the brief into a clear
            direction, design and build with care, and refine the experience around feedback. We keep
            the process collaborative, the communication straightforward, and the details intentional.
          </p>
          <p className="about-signoff">
            Not here to blend in. Here to build what’s next.
          </p>
        </div>
      </section>

      <ContactBlock />
    </div>
  );
}

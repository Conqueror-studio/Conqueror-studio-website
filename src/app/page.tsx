import Image from 'next/image';
import { industries, journal, process, projects, services, updates } from '../lib/content';

const whatsappUrl = 'https://wa.me/6281295919621';

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#hero" aria-label="Conqueror Studio home">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>CONQUEROR</span>
          <span>STUDIO</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#craft">Services</a>
          <a href="#manifesto">About</a>
          <a href="#process">Process</a>
          <a href="#journal">Journal</a>
        </nav>
        <a className="header-link" href="#contact">
          Free consultation <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section id="hero" className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow">Digital atelier · Indonesia · 2026</p>
          <h1 id="hero-heading">
            We create
            <br />
            <em>digital</em>
            <br />
            masterpieces<span className="headline-dot">.</span>
          </h1>
          <p className="lede hero-lede">
            Timeless digital experiences and intelligent systems for ambitious modern brands.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">
              Begin a conversation <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#work">
              Explore the archive <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/hero-placeholder.svg"
            alt="Abstract Renaissance-inspired study of light and form"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 48vw"
          />
          <div className="hero-visual-label">Study 01 · Light / Form</div>
          <div className="hero-visual-mark" aria-hidden="true">✦</div>
        </div>
        <p className="scroll-note">Scroll to explore <span aria-hidden="true">↓</span></p>
      </section>

      <section id="manifesto" className="manifesto section-rule" aria-labelledby="manifesto-heading">
        <div className="section-label"><span>01</span><span>Philosophy</span></div>
        <div className="manifesto-copy">
          <h2 id="manifesto-heading">Art meets<br /><em>technology.</em></h2>
          <p className="quote">“Great design should be remembered. Great systems should be invisible.”</p>
          <p className="lede">
            We believe technology should amplify craftsmanship, not replace it. Every project begins with a blank canvas and ends with something useful, distinctive, and built to last.
          </p>
        </div>
      </section>

      <section id="work" className="work section-rule" aria-labelledby="work-heading">
        <div className="section-label"><span>02</span><span>Selected work</span></div>
        <div className="section-content">
          <div className="section-intro">
            <h2 id="work-heading">A living<br /><em>archive.</em></h2>
            <p className="lede">Concept studies and commissioned work, documented as the studio grows.</p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className="project-art" style={{ background: project.tone }} aria-label={project.title + ' visual study'} role="img">
                  <span>Concept<br />archive</span>
                  <small>{project.number}</small>
                </div>
                <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span className="card-link">View study <span aria-hidden="true">↗</span></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="craft" className="craft section-rule" aria-labelledby="craft-heading">
        <div className="section-label"><span>03</span><span>Our craft</span></div>
        <div className="section-content">
          <div className="section-intro">
            <h2 id="craft-heading">Made with<br /><em>intention.</em></h2>
            <p className="lede">A small set of disciplines, brought together with care.</p>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="updates" className="updates section-rule" aria-labelledby="updates-heading">
        <div className="section-label"><span>04</span><span>Latest updates</span></div>
        <div className="section-content">
          <div className="section-intro">
            <h2 id="updates-heading">The studio<br /><em>in motion.</em></h2>
            <p className="lede">A timeline of projects, experiments, and decisions as they happen.</p>
          </div>
          <div className="update-list">
            {updates.map((update) => (
              <article className="update-row" key={update.date + update.title}>
                <time>{update.date}</time>
                <div><p className="eyebrow">{update.type}</p><h3>{update.title}</h3><p>{update.note}</p></div>
                <span aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="journal" className="journal section-rule" aria-labelledby="journal-heading">
        <div className="section-label"><span>05</span><span>Journal</span></div>
        <div className="section-content">
          <div className="section-intro">
            <h2 id="journal-heading">Notes from<br /><em>the atelier.</em></h2>
            <p className="lede">Thoughts on digital presence, thoughtful design, and invisible systems.</p>
          </div>
          <div className="journal-grid">
            {journal.map((entry) => (
              <article className="journal-card" key={entry.number}>
                <div className="journal-card-top"><span>{entry.number}</span><span>{entry.category}</span></div>
                <h3>{entry.title}</h3>
                <p>{entry.excerpt}</p>
                <span className="card-link">Read note <span aria-hidden="true">↗</span></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="industries" className="industries section-rule" aria-labelledby="industries-heading">
        <div className="section-label"><span>06</span><span>Industries</span></div>
        <div className="section-content industry-content">
          <div className="section-intro">
            <h2 id="industries-heading">Brands we<br /><em>create for.</em></h2>
            <p className="lede">Focused digital direction for people building something worth remembering.</p>
          </div>
          <div className="industry-list">
            {industries.map((industry, index) => (
              <div className="industry-item" key={industry}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{industry}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="process section-rule" aria-labelledby="process-heading">
        <div className="section-label"><span>07</span><span>Process</span></div>
        <div className="section-content">
          <div className="section-intro">
            <h2 id="process-heading">From blank canvas<br /><em>to launch.</em></h2>
            <p className="lede">A clear, collaborative path from first conversation to a living digital presence.</p>
          </div>
          <div className="process-list">
            {process.map((step, index) => (
              <article className="process-item" key={step.number}>
                <div className="process-top"><span>{step.number}</span>{index < process.length - 1 && <span aria-hidden="true">→</span>}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact" aria-labelledby="contact-heading">
        <p className="eyebrow">08 / Begin a project</p>
        <h2 id="contact-heading">Your vision deserves<br /><em>a digital masterpiece.</em></h2>
        <p className="lede">Tell us what you are building. We will help you find the clearest next step.</p>
        <a className="button button-light" href={whatsappUrl} target="_blank" rel="noreferrer">
          Free consultation <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <div>
          <p className="wordmark"><span className="brand-mark" aria-hidden="true">✦</span><span>CONQUEROR</span><span>STUDIO</span></p>
          <p className="footer-note">Crafted in Indonesia.<br />Inspired by Renaissance.<br />Powered by Technology.</p>
        </div>
        <div className="footer-links">
          <a href="mailto:conqueror.agency404@gmail.com">Email</a>
          <a href="https://instagram.com/conqueror.404" target="_blank" rel="noreferrer">Instagram</a>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
        <p className="footer-note">© 2026 Conqueror Studio</p>
      </footer>
    </main>
  );
}

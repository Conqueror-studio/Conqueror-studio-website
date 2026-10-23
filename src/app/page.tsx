import Image from 'next/image';
import HeroExperience from '../components/hero-experience';
import ToolsMarquee from '../components/tools-marquee';
import StudioStory from '../components/studio-story';
import TeamStory from '../components/team-story';
import ClosingInvitation from '../components/closing-invitation';
import FeaturedWork from '../components/featured-work';
import PricingSection from '../components/pricing-section';
import FaqSection from '../components/faq-section';
import FooterLogoPuzzle from '../components/footer-logo-puzzle';
import { process, services } from '../lib/content';

const whatsappUrl = 'https://wa.me/6281295919621?text=Halo%20Conqueror%20Studio%2C%20saya%20ingin%20mendiskusikan%20project%20baru.';
const emailUrl = 'mailto:conqueror.agency404@gmail.com?subject=Project%20inquiry%20%E2%80%94%20Conqueror%20Studio';
export default function HomePage() {
  return (
    <>
      <a href="#about" className="skip-link">Skip to content</a>
      <main>
        <HeroExperience contactUrl={whatsappUrl} />
        <ToolsMarquee />
        <StudioStory />

        <section id="about" className="about-section section-space" aria-labelledby="about-heading" data-figma-node="13:329">
          <p className="about-lede">A small team from Sukabumi building custom websites, automated workflows, and seamless tool integrations so founders can stop doing manual work and start growing.</p>
          <div className="about-copy">
            <h2 id="about-heading">Building Systems<br />That Work <span className="thinker"><Image src="/figma/thinker.png" alt="" fill sizes="90px" /></span></h2>
            <div className="about-actions">
              <a className="pill-link" href="#process">How We Work <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="#services">Our Services <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <FeaturedWork />

        <section id="services" className="services-section section-space" aria-labelledby="services-heading" data-figma-node="13:1038">
          <div className="section-heading">
            <h2 id="services-heading">Our Services</h2>
            <a className="pill-link" href="#contact">Let’s talk services <span aria-hidden="true">↗</span></a>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <details className="service-item" key={service.number}>
                <summary><span>{service.title}</span><span className="service-symbol" aria-hidden="true">↗</span></summary>
                <div className="service-description"><p>{service.description}</p><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Discuss this service <span aria-hidden="true">↗</span></a></div>
              </details>
            ))}
          </div>
        </section>

        <section className="studio-marquee" aria-label="Designing for Humans. Automating the Rest." data-figma-node="13:1259">
          <div className="marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => <div className="marquee-group" key={copy}>
              <span>Designing for Humans</span>
              <Image src="/team/studio-marquee.jpg" alt="" width={210} height={210} sizes="(max-width: 700px) 72px, 210px" />
              <span>Automating the Rest</span>
              <Image className="marquee-logo" src="/brand/conqueror-studio.svg" alt="" width={970} height={288} sizes="(max-width: 700px) 72px, 210px" />
            </div>)}
          </div>
        </section>

        <TeamStory />

        <section id="process" className="process-section section-space" aria-labelledby="process-heading">
          <details className="process-disclosure">
            <summary><h2 id="process-heading">How We Work</h2><span aria-hidden="true">+</span></summary>
            <ol>{process.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
          </details>
        </section>
        <PricingSection contactUrl={whatsappUrl} />
        <FaqSection />
        <ClosingInvitation />
      </main>

      <footer id="contact" className="site-footer" aria-labelledby="contact-heading" data-figma-node="87:228">
        <div className="footer-top">
          <div className="footer-contact">
            <h2 id="contact-heading">Let’s create your next chapter.</h2>
            <a className="contact-pill" href={whatsappUrl} target="_blank" rel="noreferrer">Start on WhatsApp <span aria-hidden="true">↗</span></a>
            <a className="footer-email" href={emailUrl}>conqueror.agency404@gmail.com</a>
            <div className="social-links"><a href="https://instagram.com/conqueror.404" target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a><a href={emailUrl}>Email <span aria-hidden="true">↗</span></a></div>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div><a href="#services">Services</a><a href="#work">Work</a><a href="#about">About</a></div>
            <div><a href="#team">Our Team</a><a href="#process">How We Work</a><a href="#pricing">Pricing</a></div>
            <div><span>Sukabumi</span><a href={emailUrl}>Contact <span aria-hidden="true">↗</span></a></div>
          </nav>
        </div>
        <FooterLogoPuzzle />
        <div className="footer-bottom"><span>© 2026 Conqueror Studio. All rights reserved</span><span>Website MadeByConqueror</span></div>
      </footer>
    </>
  );
}

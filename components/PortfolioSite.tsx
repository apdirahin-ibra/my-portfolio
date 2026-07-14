import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { DEFAULT_CONTENT } from '../data/defaultContent';
import type { PortfolioContent, Project } from '../types';

const navItems = [
  ['About', 'about'],
  ['Work', 'work'],
  ['Expertise', 'expertise'],
  ['Journey', 'journey'],
  ['Contact', 'contact'],
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.14 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionIntro({ index, label, title, copy }: { index: string; label: string; title: string; copy?: string }) {
  return (
    <motion.div className="section-intro" {...reveal}>
      <div className="section-kicker"><span>{index}</span>{label}</div>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </motion.div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const images = project.galleryImages?.length ? project.galleryImages : [project.imageUrl];
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setActiveImage((value) => (value + 1) % images.length);
      if (event.key === 'ArrowLeft') setActiveImage((value) => (value - 1 + images.length) % images.length);
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [images.length, onClose]);

  return (
    <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project details`}
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.35 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close project details"><X /></button>
        <div className="modal-visual">
          <img src={images[activeImage]} alt={`${project.title} view ${activeImage + 1}`} />
          {images.length > 1 && (
            <div className="modal-controls">
              <button type="button" aria-label="Previous image" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}><ChevronLeft /></button>
              <span>{String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              <button type="button" aria-label="Next image" onClick={() => setActiveImage((activeImage + 1) % images.length)}><ChevronRight /></button>
            </div>
          )}
        </div>
        <div className="modal-copy">
          <span className="project-meta">{project.category} · {project.year}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="modal-actions">
            {project.demoUrl && <a className="button button-light" href={project.demoUrl} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight /></a>}
            {project.githubUrl && <a className="text-link text-link-light" href={project.githubUrl} target="_blank" rel="noreferrer">View source <Github /></a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioSite() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [contactState, setContactState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/content', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json() as { content?: PortfolioContent };
        if (data.content) setContent(data.content);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const featuredProjects = useMemo(() => content.projects.filter((project) => project.featured).slice(0, 3), [content.projects]);
  const visibleProjects = showAllProjects ? content.projects : featuredProjects.length ? featuredProjects : content.projects.slice(0, 3);
  const { profile } = content;

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState('sending');
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      if (!response.ok) throw new Error('Request failed');
      form.reset();
      setContactState('sent');
    } catch {
      setContactState('error');
    }
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" onClick={(event) => { event.preventDefault(); scrollTo('top'); }} aria-label={`${profile.shortName} home`}>
          <span>AI</span><strong>{profile.shortName}.</strong>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }}>{label}</a>)}
        </nav>
        <a className="header-cta" href={`mailto:${profile.email}`}>Start a project <ArrowUpRight /></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            {navItems.map(([label, id], index) => (
              <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }}><span>0{index + 1}</span>{label}<ArrowRight /></a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="hero" id="top">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="availability"><span />{profile.availability}</div>
            <p className="hero-eyebrow">{profile.eyebrow}</p>
            <h1>{profile.headline}</h1>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions">
              <button className="button button-accent" type="button" onClick={() => scrollTo('work')}>Explore selected work <ArrowDown /></button>
              <a className="text-link text-link-light" href={profile.cvUrl} download>Download résumé <Download /></a>
            </div>
          </motion.div>

          <motion.div className="hero-portrait-wrap" initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
            <div className="portrait-frame">
              <img src={profile.portrait} alt={`${profile.name}, ${profile.role}`} fetchPriority="high" />
              <div className="portrait-sheen" />
            </div>
            <div className="portrait-label"><small>Based in</small><strong>{profile.location}</strong></div>
            <div className="portrait-code">01 / 04</div>
          </motion.div>

          <div className="hero-bottom">
            <div><span>Currently</span><strong>{profile.role}</strong></div>
            <button type="button" onClick={() => scrollTo('about')} aria-label="Scroll to about"><ArrowDown /></button>
          </div>
        </section>

        <section className="stats-strip" aria-label="Career highlights">
          <span className="stats-lead">Proof, not promises.</span>
          {content.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </section>

        <section className="section section-cream" id="about">
          <SectionIntro index="01" label="A little about me" title="Strategy, craft, and code—in one place." />
          <motion.div className="about-grid" {...reveal}>
            <p className="about-lead">I build at the intersection of <em>useful technology</em> and thoughtful user experience.</p>
            <div className="about-detail">
              <p>{profile.bio}</p>
              <a className="text-link" href={`mailto:${profile.email}`}>Let’s work together <ArrowUpRight /></a>
            </div>
          </motion.div>
          <div className="services-grid">
            {content.services.map((service, index) => (
              <motion.article key={service.id} className="service-card" {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }}>
                <span>{service.number}</span><h3>{service.title}</h3><p>{service.description}</p><ArrowUpRight />
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section section-work" id="work">
          <SectionIntro index="02" label="Selected work" title="Projects with a job to do." copy="A selection of web platforms and applied AI systems designed around real users, real constraints, and measurable outcomes." />
          <div className="project-grid">
            {visibleProjects.map((project, index) => (
              <motion.button
                type="button"
                key={project.id}
                className={`project-card project-card-${index % 3}`}
                onClick={() => setSelectedProject(project)}
                {...reveal}
              >
                <div className="project-image"><img src={project.imageUrl} alt="" loading="lazy" /><div className="project-open"><ArrowUpRight /></div></div>
                <div className="project-card-copy">
                  <span className="project-meta">{project.category} · {project.year}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="tag-row">{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </motion.button>
            ))}
          </div>
          {content.projects.length > 3 && (
            <button className="button button-outline project-toggle" type="button" onClick={() => setShowAllProjects(!showAllProjects)}>
              {showAllProjects ? 'Show selected work' : `View all ${content.projects.length} projects`} <ArrowRight />
            </button>
          )}
        </section>

        <section className="section section-dark" id="expertise">
          <SectionIntro index="03" label="Expertise" title="A broad toolkit, applied with focus." />
          <div className="skills-layout">
            <motion.div className="skills-statement" {...reveal}>
              <p>From interface to infrastructure, I choose the right tool for the problem—not the trend.</p>
              <div className="signal"><span /><span /><span /><span /><span /><span /></div>
            </motion.div>
            <div className="skill-groups">
              {content.skillGroups.map((group, index) => (
                <motion.article className="skill-group" key={group.id} {...reveal}>
                  <span className="skill-number">0{index + 1}</span>
                  <div><h3>{group.title}</h3><p>{group.description}</p><div className="skill-list">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-cream" id="journey">
          <SectionIntro index="04" label="Journey" title="Experience built by doing." copy="Roles where I have shipped products, supported teams, and turned emerging technology into practical results." />
          <div className="timeline">
            {content.experience.map((item, index) => (
              <motion.article className="timeline-item" key={item.id} {...reveal}>
                <div className="timeline-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="timeline-period">{item.period}<small>{item.location}</small></div>
                <div className="timeline-role"><h3>{item.role}</h3><strong>{item.company}</strong></div>
                <div className="timeline-detail">
                  {item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}
                  <p>{item.description}</p><div className="tag-row">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
              </motion.article>
            ))}
          </div>

          {content.education.length > 0 && (
            <div className="education-block">
              <h3>Education</h3>
              {content.education.map((item) => (
                <motion.article className="education-card" key={item.id} {...reveal}>
                  {item.imageUrl && <img src={item.imageUrl} alt="" loading="lazy" />}
                  <div><span>{item.period}</span><h4>{item.degree}</h4><strong>{item.institution}</strong><p>{item.description}</p></div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-heading">
            <span>Have a project in mind?</span>
            <h2>Let’s make something<br /><em>remarkable.</em></h2>
            <p>Tell me what you’re building, where you’re stuck, or the outcome you want. I’ll reply with a clear next step.</p>
            <div className="contact-links">
              <a href={`mailto:${profile.email}`}><Mail />{profile.email}</a>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`}><Phone />{profile.phone}</a>
              <span><MapPin />{profile.location}</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={sendMessage}>
            <div className="field-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label></div>
            <label>What do you need?<select name="projectType" defaultValue=""><option value="" disabled>Select a project type</option><option>Website or web application</option><option>AI or machine learning</option><option>IT consultancy</option><option>Something else</option></select></label>
            <label>Project details<textarea name="message" required rows={5} placeholder="A few details about your idea, goals, and timeline…" /></label>
            <button className="button button-accent" type="submit" disabled={contactState === 'sending'}>
              {contactState === 'sending' ? 'Sending…' : contactState === 'sent' ? <><Check /> Message sent</> : <>Send enquiry <ArrowUpRight /></>}
            </button>
            {contactState === 'error' && <p className="form-error">Something went wrong. Please email me directly instead.</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><span>AI</span><strong>{profile.shortName}.</strong></div>
        <p>Designing and engineering useful digital products from Mogadishu to the world.</p>
        <div className="footer-socials">
          <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><a href="/admin">Admin</a><button type="button" onClick={() => scrollTo('top')}>Back to top <ArrowUpRight /></button></div>
      </footer>

      <a className="whatsapp" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle /></a>

      <AnimatePresence>{selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}</AnimatePresence>
    </div>
  );
}

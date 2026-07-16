import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Network,
  Phone,
  Sun,
  X,
} from 'lucide-react';
import { DEFAULT_CONTENT } from '../data/defaultContent';
import type { PortfolioContent, Project } from '../types';

type Theme = 'dark' | 'light';

const navigation = [
  ['Work', 'work'],
  ['Expertise', 'expertise'],
  ['About', 'about'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
] as const;

const reveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
};

const canonicalProjectTitles: Record<string, string> = {
  'araday kaaliye': 'Araday Kaaliye',
  'somali national women organization': 'Somali National Women Organization',
  'news classification using ml': 'News Classification Using ML',
  kunshilin: 'Kunshilin',
  'house property tax management system': 'House Property Tax Management System',
};

const projectTitle = (title: string) => canonicalProjectTitles[title.trim().toLowerCase()] || title;

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem('abdirahin-portfolio-theme-v1');
  if (saved === 'dark' || saved === 'light') return saved;
  return 'dark';
}

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      className="pf-theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === 'light'}
      title={`Switch to ${next} mode`}
    >
      <span className={theme === 'light' ? 'is-active' : ''}><Sun aria-hidden="true" /></span>
      <span className={theme === 'dark' ? 'is-active' : ''}><Moon aria-hidden="true" /></span>
    </button>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const images = project.galleryImages?.length ? project.galleryImages : [project.imageUrl];
  const [activeImage, setActiveImage] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const title = projectTitle(project.title);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const backgroundElements = Array.from(document.querySelectorAll<HTMLElement>('.pf-header, .pf-site > main, .pf-footer, .pf-whatsapp'));
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setActiveImage((index) => (index + 1) % images.length);
      if (event.key === 'ArrowLeft') setActiveImage((index) => (index - 1 + images.length) % images.length);
      if (event.key === 'Tab' && dialog) {
        const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        if (focusable.length === 0) {
          event.preventDefault();
          dialog.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const focusFrame = window.requestAnimationFrame(() => {
      (dialog?.querySelector<HTMLElement>('.pf-modal-close') ?? dialog)?.focus();
    });
    backgroundElements.forEach((element) => element.setAttribute('inert', ''));
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKey);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      backgroundElements.forEach((element) => element.removeAttribute('inert'));
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKey);
      previouslyFocused?.focus();
    };
  }, [images.length, onClose]);

  return (
    <motion.div className="pf-modal-backdrop" initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div
        ref={dialogRef}
        className="pf-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
        tabIndex={-1}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 44, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.985 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.34 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="pf-modal-close" type="button" onClick={onClose} aria-label="Close project details"><X /></button>
        <div className="pf-modal-media">
          <img src={images[activeImage]} alt={`${title} project view ${activeImage + 1}`} decoding="async" />
          {images.length > 1 && (
            <div className="pf-modal-controls">
              <button type="button" onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)} aria-label="Previous project image"><ChevronLeft /></button>
              <span>{String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
              <button type="button" onClick={() => setActiveImage((activeImage + 1) % images.length)} aria-label="Next project image"><ChevronRight /></button>
            </div>
          )}
        </div>
        <div className="pf-modal-copy">
          <div className="pf-eyebrow">{project.category} · {project.year}</div>
          <h2 id={`project-modal-title-${project.id}`}>{title}</h2>
          <p>{project.description}</p>
          <div className="pf-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          <div className="pf-modal-actions">
            {project.demoUrl && <a className="pf-button pf-button-accent" href={project.demoUrl} target="_blank" rel="noreferrer">View live project <ArrowUpRight /></a>}
            {project.githubUrl && <a className="pf-text-link" href={project.githubUrl} target="_blank" rel="noreferrer">Source code <Github /></a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioSite() {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [contactState, setContactState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const prefersReducedMotion = useReducedMotion();
  const revealProps = prefersReducedMotion ? { initial: false as const } : reveal;
  const closeProject = useCallback(() => setSelectedProject(null), []);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('abdirahin-portfolio-theme-v1', theme);
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'dark' ? '#070e16' : '#f3eee5';
    return () => { document.documentElement.style.removeProperty('color-scheme'); };
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 28);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] });
    navigation.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

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

  const featuredProjects = useMemo(() => {
    const featured = content.projects.filter((project) => project.featured);
    const remaining = content.projects.filter((project) => !project.featured);
    return [...featured, ...remaining].slice(0, 5);
  }, [content.projects]);
  const visibleProjects = showAllProjects ? content.projects : featuredProjects;
  const { profile } = content;
  const heroHeadline = profile.headline.trim();
  const heroHeadlineHasDot = heroHeadline.endsWith('.');

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setContactState('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      if (!response.ok) throw new Error('Message failed');
      form.reset();
      setContactState('sent');
    } catch {
      setContactState('error');
    }
  };

  return (
    <div className="pf-site" id="top" data-theme={theme}>
      <header className={`pf-header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="pf-brand" href="#top" onClick={(event) => { event.preventDefault(); scrollTo('top'); }} aria-label={`${profile.name} home`}>
          <span>AI</span><strong>{profile.name}</strong>
        </a>
        <nav className="pf-nav" aria-label="Primary navigation">
          {navigation.map(([label, id]) => <a key={id} className={activeSection === id ? 'is-active' : undefined} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={(event) => { event.preventDefault(); scrollTo(id); }}>{label}</a>)}
        </nav>
        <div className="pf-header-actions">
          <ThemeButton theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
          <a className="pf-header-cta" href="#contact" onClick={(event) => { event.preventDefault(); scrollTo('contact'); }}>Start a project <ArrowUpRight /></a>
          <button className="pf-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav id="mobile-navigation" className="pf-mobile-nav" initial={prefersReducedMotion ? false : { opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} aria-label="Mobile navigation">
            {navigation.map(([label, id], index) => <a key={id} className={activeSection === id ? 'is-active' : undefined} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={(event) => { event.preventDefault(); scrollTo(id); }}><span>0{index + 1}</span>{label}<ArrowRight /></a>)}
          </motion.nav>
        )}
      </AnimatePresence>

      <main>
        <section className="pf-hero">
          <motion.div className="pf-hero-copy" initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.75 }}>
            <div className="pf-availability"><span />{profile.availability}</div>
            <p className="pf-hero-specialties">{profile.eyebrow}</p>
            <h1>
              {heroHeadlineHasDot ? heroHeadline.slice(0, -1) : heroHeadline}
              {heroHeadlineHasDot && <em>.</em>}
            </h1>
            <p className="pf-hero-intro">{profile.intro}</p>
            <div className="pf-hero-actions">
              <button className="pf-button pf-button-accent" type="button" onClick={() => scrollTo('work')}>Explore selected work <ArrowRight /></button>
              <a className="pf-text-link" href={profile.cvUrl} download>Download résumé <Download /></a>
            </div>
            <div className="pf-trust">
              <span>Trusted by teams & organizations</span>
              <div>
                <strong><Building2 />Somali National<br />Women Organization</strong>
                <strong><Network />Kunshilin</strong>
                <strong><Code2 />IoT Stack<br />Solutions</strong>
              </div>
            </div>
          </motion.div>

          <motion.div className="pf-hero-art" initial={prefersReducedMotion ? false : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: prefersReducedMotion ? 0 : 0.85, delay: prefersReducedMotion ? 0 : 0.08 }}>
            <img
              src={profile.portrait || '/images/myimage.jpeg'}
              onError={(event) => { event.currentTarget.src = '/images/myimage.jpeg'; }}
              alt={`${profile.name}, ${profile.role}`}
              fetchPriority="high"
              decoding="async"
            />
            <div className="pf-hero-folio"><span>Selected portrait</span><strong>01</strong></div>
          </motion.div>

          <button className="pf-scroll-cue" type="button" onClick={() => scrollTo('about')} aria-label="Scroll to profile"><ArrowDown /></button>
        </section>

        <section className="pf-proof" aria-label="Career highlights">
          <div className="pf-proof-lead"><strong>Proof, not</strong><span>promises.</span></div>
          <div className="pf-proof-stats">
            {content.stats.map((stat, index) => <div className="pf-proof-stat" key={`${stat.value}-${stat.label}-${index}`}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
          </div>
        </section>

        <section className="pf-about" id="about">
          <motion.div className="pf-section-label" {...revealProps}><span />Philosophy</motion.div>
          <div className="pf-about-grid">
            <motion.div {...revealProps}>
              <h2>Strategy, craft, and code—<em>in one place.</em></h2>
              <p className="pf-about-lead">I build at the intersection of <mark>useful technology</mark> and thoughtful user experience.</p>
            </motion.div>
            <motion.div className="pf-about-copy" {...revealProps}>
              <p>{profile.bio}</p>
              <a className="pf-text-link" href={`mailto:${profile.email}`}>Let’s work together <ArrowUpRight /></a>
            </motion.div>
          </div>
          {content.services.length > 0 && (
            <div className="pf-services" aria-label="Services">
              {content.services.map((service) => (
                <motion.article key={service.id} {...revealProps}>
                  <span>{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a className="pf-service-link" href="#contact" onClick={(event) => { event.preventDefault(); scrollTo('contact'); }} aria-label={`Discuss ${service.title}`}><ArrowUpRight aria-hidden="true" /></a>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <section className="pf-work" id="work">
          <motion.div className="pf-work-heading" {...revealProps}>
            <div><div className="pf-section-label"><span />Selected work</div><h2>Projects with<br />a job to do.</h2></div>
            <p>A selection of web platforms and applied AI systems designed around real users, real constraints, and measurable outcomes.</p>
          </motion.div>

          <div className="pf-case-list">
            {visibleProjects.map((project, index) => (
              <motion.article className="pf-case" key={project.id} {...revealProps}>
                <span className="pf-case-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="pf-case-copy">
                  <span className="pf-case-type">{project.category}</span>
                  <h3>{projectTitle(project.title)}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="pf-case-visual"><img src={project.imageUrl} alt={`${projectTitle(project.title)} interface`} loading="lazy" decoding="async" /></div>
                <div className="pf-case-meta">
                  <span className="pf-case-link">View case study <ArrowUpRight /></span>
                  <dl>
                    <div><dt>Role</dt><dd>{project.category}</dd></div>
                    <div><dt>Year</dt><dd>{project.year}</dd></div>
                    <div><dt>Stack</dt><dd>{project.tags.slice(0, 3).join(', ')}</dd></div>
                  </dl>
                </div>
                <button className="pf-case-hit" type="button" onClick={() => setSelectedProject(project)} aria-label={`Open ${projectTitle(project.title)} case study`} />
              </motion.article>
            ))}
          </div>

          {content.projects.length > featuredProjects.length && (
            <button className="pf-all-projects" type="button" onClick={() => setShowAllProjects(!showAllProjects)}>
              {showAllProjects ? 'Show selected projects' : `View all ${content.projects.length} projects`} <ArrowRight />
            </button>
          )}
        </section>

        <section className="pf-expertise" id="expertise">
          <motion.div className="pf-expertise-intro" {...revealProps}>
            <div className="pf-section-label"><span />Capabilities</div>
            <h2>A broad toolkit,<br />applied with focus.</h2>
            <p>From interface to infrastructure, I choose the right tool for the problem—not the trend.</p>
          </motion.div>
          <div className="pf-skill-groups">
            {content.skillGroups.map((group, index) => (
              <motion.article key={group.id} {...revealProps}>
                <span>0{index + 1}</span>
                <div><h3>{group.title}</h3><p>{group.description}</p><div className="pf-tags">{group.skills.map((skill) => <small key={skill}>{skill}</small>)}</div></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="pf-experience" id="experience">
          <motion.div className="pf-experience-heading" {...revealProps}>
            <div className="pf-section-label"><span />Experience</div>
            <h2>Experience built<br />by doing.</h2>
            <p>Roles where I have shipped products, supported teams, and turned emerging technology into practical results.</p>
          </motion.div>
          <div className="pf-experience-list">
            {content.experience.map((item, index) => (
              <motion.article key={item.id} {...revealProps}>
                <span className="pf-experience-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="pf-experience-time"><strong>{item.period}</strong><span>{item.location}</span></div>
                <div className="pf-experience-role"><h3>{item.role}</h3><span>{item.company}</span></div>
                <div className="pf-experience-copy">{item.imageUrl && <img className="pf-experience-image" src={item.imageUrl} alt={`${item.company || item.role} work`} loading="lazy" decoding="async" />}<p>{item.description}</p><div className="pf-tags">{item.skills.map((skill) => <small key={skill}>{skill}</small>)}</div></div>
              </motion.article>
            ))}
          </div>

          {content.education.length > 0 && (
            <div className="pf-education">
              <div className="pf-section-label"><span />Education</div>
              {content.education.map((item) => <article key={item.id}>{item.imageUrl && <img src={item.imageUrl} alt={`${item.degree} at ${item.institution}`} loading="lazy" decoding="async" />}<div><span>{item.period}</span><h3>{item.degree}</h3><strong>{item.institution}</strong><p>{item.description}</p></div></article>)}
            </div>
          )}
        </section>

        <section className="pf-contact" id="contact">
          <motion.div className="pf-contact-copy" {...revealProps}>
            <div className="pf-section-label"><span />Let’s connect</div>
            <h2>Let’s build<br />what’s <em>next.</em></h2>
            <p>Tell me about your idea, your team, or the problem you want to solve. I’ll reply with a clear next step.</p>
            <div>
              <a href={`mailto:${profile.email}`}><Mail />{profile.email}</a>
              <a href={`tel:${profile.phone.replace(/\s/g, '')}`}><Phone />{profile.phone}</a>
              <span><MapPin />{profile.location}</span>
            </div>
          </motion.div>
          <motion.form className="pf-contact-form" onSubmit={sendMessage} aria-busy={contactState === 'sending'} aria-describedby={contactState === 'idle' || contactState === 'sending' ? undefined : 'contact-form-status'} {...revealProps}>
            <div className="pf-form-row">
              <label htmlFor="contact-name">Your name<input id="contact-name" name="name" type="text" autoComplete="name" required placeholder="Your name" /></label>
              <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" required placeholder="you@example.com" /></label>
            </div>
            <label htmlFor="contact-project-type">Project type<select id="contact-project-type" name="projectType" defaultValue=""><option value="" disabled>Select a project type</option><option>Website or web application</option><option>AI or machine learning</option><option>IT consultancy</option><option>Something else</option></select></label>
            <label htmlFor="contact-message">Tell me about your project<textarea id="contact-message" name="message" required rows={5} placeholder="A few details about your idea, goals, and timeline…" /></label>
            <button className="pf-button pf-button-accent" type="submit" disabled={contactState === 'sending'}>
              {contactState === 'sending' ? 'Sending…' : contactState === 'sent' ? <><Check /> Message sent</> : <>Send message <ArrowUpRight /></>}
            </button>
            <div className="pf-form-status" id="contact-form-status" aria-live="polite" aria-atomic="true">
              {contactState === 'sent' && <p>Your message was sent successfully.</p>}
              {contactState === 'error' && <p className="pf-form-error">The message could not be sent. Please email me directly.</p>}
            </div>
          </motion.form>
        </section>
      </main>

      <footer className="pf-footer">
        <div><a className="pf-brand" href="#top" onClick={(event) => { event.preventDefault(); scrollTo('top'); }}><span>AI</span><strong>{profile.name}</strong></a><p>Building intelligent digital products that solve real problems.</p></div>
        <nav>{navigation.map(([label, id]) => <a key={id} href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollTo(id); }}>{label}</a>)}</nav>
        <div className="pf-socials"><a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a><a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a><a href={`mailto:${profile.email}`} aria-label="Email"><Mail /></a></div>
        <div className="pf-footer-bottom"><span>© {new Date().getFullYear()} {profile.name}</span><a href="/admin">Admin</a><button type="button" onClick={() => scrollTo('top')} aria-label="Back to top">Back to top <ArrowUp /></button></div>
      </footer>

      <a className="pf-whatsapp" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle /></a>
      <AnimatePresence>{selectedProject && <ProjectModal project={selectedProject} onClose={closeProject} />}</AnimatePresence>
    </div>
  );
}

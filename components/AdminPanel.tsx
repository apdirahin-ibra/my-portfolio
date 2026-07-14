import React, { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  ExternalLink,
  Eye,
  GraduationCap,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Menu,
  Plus,
  Save,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { cloneDefaultContent } from '../data/defaultContent';
import type { ContactMessage, EducationItem, ExperienceItem, PortfolioContent, Project, Service, SkillGroup, Stat } from '../types';

type Tab = 'overview' | 'profile' | 'projects' | 'experience' | 'education' | 'expertise' | 'inbox';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'Profile', icon: CircleUserRound },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'experience', label: 'Experience', icon: Sparkles },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'expertise', label: 'Expertise', icon: Settings2 },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
];

function Field({ label, value, onChange, placeholder, type = 'text', help }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; help?: string }) {
  return <label className="admin-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />{help && <small>{help}</small>}</label>;
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }) {
  return <label className="admin-field"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} /></label>;
}

function StringList({ label, values, onChange, placeholder = 'React, TypeScript, Node.js' }: { label: string; values: string[]; onChange: (value: string[]) => void; placeholder?: string }) {
  return <Field label={label} value={values.join(', ')} onChange={(value) => onChange(value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder={placeholder} help="Separate items with commas." />;
}

function ImageField({ label, value, onChange, onUpload }: { label: string; value: string; onChange: (value: string) => void; onUpload: (file: File) => Promise<string> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      onChange(await onUpload(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="admin-field image-field">
      <span>{label}</span>
      <div className="image-field-row">
        <div className="image-preview">{value ? <img src={value} alt="Current upload" /> : <ImagePlus />}</div>
        <div className="image-field-controls">
          <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Image URL or upload a file" />
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(event) => upload(event.target.files?.[0])} />
          <button type="button" className="admin-button admin-button-soft" onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <><LoaderCircle className="spin" /> Uploading…</> : <><ImagePlus /> Upload image</>}
          </button>
          {error && <small className="admin-error">{error}</small>}
        </div>
      </div>
    </div>
  );
}

function EditorCard({ title, subtitle, open, onToggle, onDelete, onMoveUp, onMoveDown, children }: { title: string; subtitle: string; open: boolean; onToggle: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void; children: ReactNode }) {
  return (
    <article className={`editor-card ${open ? 'is-open' : ''}`}>
      <div className="editor-card-head">
        <button type="button" className="editor-card-toggle" onClick={onToggle}><span><strong>{title || 'Untitled item'}</strong><small>{subtitle}</small></span>{open ? <ChevronUp /> : <ChevronDown />}</button>
        <div className="editor-card-actions"><button type="button" onClick={onMoveUp} aria-label="Move up"><ChevronUp /></button><button type="button" onClick={onMoveDown} aria-label="Move down"><ChevronDown /></button><button type="button" className="danger" onClick={onDelete} aria-label="Delete"><Trash2 /></button></div>
      </div>
      {open && <div className="editor-card-body">{children}</div>}
    </article>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(data.message || 'Unable to sign in');
      onSuccess();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <a className="admin-login-brand" href="/"><span>AI</span><strong>Abdirahin.</strong></a>
      <form onSubmit={submit} className="login-card">
        <div className="login-icon"><LockKeyhole /></div>
        <span className="admin-kicker">Private workspace</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage portfolio content, images, and enquiries.</p>
        <label><span>Admin password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus autoComplete="current-password" placeholder="Enter your password" /></label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-button admin-button-primary" type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" /> Signing in…</> : <>Open dashboard <ExternalLink /></>}</button>
      </form>
      <p className="login-footnote">Protected with an encrypted, HTTP-only session.</p>
    </main>
  );
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [content, setContent] = useState<PortfolioContent>(cloneDefaultContent());
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [openId, setOpenId] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saved' | 'error'>('idle');
  const [setupError, setSetupError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const loadContent = async () => {
    try {
      const response = await fetch('/api/admin/content', { cache: 'no-store' });
      if (response.status === 401) { setAuthenticated(false); return; }
      const data = await response.json() as { content?: PortfolioContent; message?: string };
      if (!response.ok) throw new Error(data.message || 'The content service is not configured yet.');
      if (data.content) setContent(data.content);
      setAuthenticated(true);
      setSetupError('');
    } catch (error) {
      setAuthenticated(true);
      setSetupError(error instanceof Error ? error.message : 'Unable to reach the content service.');
    }
  };

  useEffect(() => { loadContent(); }, []);

  useEffect(() => {
    if (activeTab !== 'inbox' || messagesLoaded || !authenticated) return;
    fetch('/api/admin/messages', { cache: 'no-store' }).then(async (response) => {
      if (!response.ok) return;
      const data = await response.json() as { messages?: ContactMessage[] };
      setMessages(data.messages || []);
      setMessagesLoaded(true);
    }).catch(() => undefined);
  }, [activeTab, authenticated, messagesLoaded]);

  const update = (next: PortfolioContent) => { setContent(next); setDirty(true); setSaveState('idle'); };
  const updateProfile = (key: keyof PortfolioContent['profile'], value: string) => update({ ...content, profile: { ...content.profile, [key]: value } });

  const uploadImage = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
    const result = await response.json().catch(() => ({})) as { url?: string; message?: string };
    if (!response.ok || !result.url) throw new Error(result.message || 'Upload failed');
    return result.url;
  };

  const save = async () => {
    setSaving(true);
    setSaveState('idle');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
      const data = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) throw new Error(data.message || 'Could not publish changes');
      setDirty(false);
      setSaveState('saved');
      setSetupError('');
      window.setTimeout(() => setSaveState('idle'), 3000);
    } catch (error) {
      setSaveState('error');
      setSetupError(error instanceof Error ? error.message : 'Could not publish changes');
    } finally { setSaving(false); }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    setAuthenticated(false);
  };

  const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return items;
    const copy = [...items];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    return copy;
  };

  const nav = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); setOpenId(''); };

  if (authenticated === null) return <main className="admin-loading"><LoaderCircle className="spin" /><span>Opening your workspace…</span></main>;
  if (!authenticated) return <Login onSuccess={loadContent} />;

  const pageTitle = tabs.find((tab) => tab.id === activeTab)?.label || 'Dashboard';
  const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-head"><a href="/" className="admin-brand"><span>AI</span><strong>Studio</strong></a><button type="button" onClick={() => setSidebarOpen(false)}><X /></button></div>
        <nav>
          <span className="sidebar-label">Workspace</span>
          {tabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => nav(tab.id)}><tab.icon />{tab.label}{tab.id === 'inbox' && messages.filter((message) => message.status === 'new').length > 0 && <small>{messages.filter((message) => message.status === 'new').length}</small>}</button>)}
        </nav>
        <div className="admin-sidebar-foot"><a href="/" target="_blank"><Eye />View live portfolio<ExternalLink /></a><button type="button" onClick={logout}><LogOut />Sign out</button></div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" type="button" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <div><span>Portfolio manager</span><h1>{pageTitle}</h1></div>
          <div className="admin-topbar-actions">
            <a className="admin-button admin-button-soft" href="/" target="_blank"><Eye />Preview</a>
            <button className="admin-button admin-button-primary" type="button" onClick={save} disabled={saving || !dirty}>
              {saving ? <LoaderCircle className="spin" /> : saveState === 'saved' ? <Check /> : <Save />}{saving ? 'Publishing…' : saveState === 'saved' ? 'Published' : 'Publish changes'}
            </button>
          </div>
        </header>

        {setupError && <div className="setup-alert"><strong>Action needed</strong><span>{setupError}</span>{saveState === 'error' && <button type="button" onClick={save}>Try again</button>}</div>}

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              <section className="welcome-panel"><span className="admin-kicker">Content control center</span><h2>Your portfolio is ready to evolve.</h2><p>Keep your strongest work, latest roles, and professional story up to date from one place.</p><button type="button" className="admin-button admin-button-light" onClick={() => nav('projects')}>Manage projects <ExternalLink /></button></section>
              <div className="metric-grid">
                <button type="button" onClick={() => nav('projects')}><BriefcaseBusiness /><strong>{content.projects.length}</strong><span>Projects</span></button>
                <button type="button" onClick={() => nav('experience')}><Sparkles /><strong>{content.experience.length}</strong><span>Roles</span></button>
                <button type="button" onClick={() => nav('education')}><GraduationCap /><strong>{content.education.length}</strong><span>Education</span></button>
                <button type="button" onClick={() => nav('inbox')}><Inbox /><strong>{messages.length}</strong><span>Enquiries</span></button>
              </div>
              <section className="admin-panel recent-panel"><div className="admin-panel-head"><div><span>Featured work</span><h3>Homepage projects</h3></div><button type="button" onClick={() => nav('projects')}>Edit all</button></div>{content.projects.filter((project) => project.featured).slice(0, 4).map((project) => <div className="dashboard-project" key={project.id}><img src={project.imageUrl} alt="" /><div><strong>{project.title}</strong><span>{project.category} · {project.year}</span></div><Check /></div>)}</section>
              <section className="admin-panel checklist-panel"><div className="admin-panel-head"><div><span>Quality check</span><h3>Portfolio health</h3></div></div><div><Check /><span><strong>Professional profile</strong><small>Your headline, bio, and contact details are filled in.</small></span></div><div><Check /><span><strong>Selected work</strong><small>{content.projects.filter((project) => project.featured).length} projects currently featured.</small></span></div><div className={content.education.length ? '' : 'pending'}>{content.education.length ? <Check /> : <Plus />}<span><strong>Education history</strong><small>{content.education.length ? 'Education details are visible on your journey.' : 'Add education when you are ready.'}</small></span></div></section>
            </div>
          )}

          {activeTab === 'profile' && (
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Identity & positioning</span><h2>Profile</h2><p>Update the story and contact details visitors see across the portfolio.</p></div></div><div className="admin-form-grid"><Field label="Full name" value={content.profile.name} onChange={(value) => updateProfile('name', value)} /><Field label="Short name" value={content.profile.shortName} onChange={(value) => updateProfile('shortName', value)} /><Field label="Specialties line" value={content.profile.eyebrow} onChange={(value) => updateProfile('eyebrow', value)} /><Field label="Current role" value={content.profile.role} onChange={(value) => updateProfile('role', value)} /><div className="span-2"><Textarea label="Hero headline" value={content.profile.headline} onChange={(value) => updateProfile('headline', value)} rows={3} /></div><div className="span-2"><Textarea label="Short introduction" value={content.profile.intro} onChange={(value) => updateProfile('intro', value)} /></div><div className="span-2"><Textarea label="About biography" value={content.profile.bio} onChange={(value) => updateProfile('bio', value)} rows={6} /></div><div className="span-2"><ImageField label="Profile portrait" value={content.profile.portrait} onChange={(value) => updateProfile('portrait', value)} onUpload={uploadImage} /></div><Field label="Availability" value={content.profile.availability} onChange={(value) => updateProfile('availability', value)} /><Field label="Location" value={content.profile.location} onChange={(value) => updateProfile('location', value)} /><Field label="Email" type="email" value={content.profile.email} onChange={(value) => updateProfile('email', value)} /><Field label="Phone" value={content.profile.phone} onChange={(value) => updateProfile('phone', value)} /><Field label="WhatsApp number" value={content.profile.whatsapp} onChange={(value) => updateProfile('whatsapp', value)} /><Field label="Résumé URL" value={content.profile.cvUrl} onChange={(value) => updateProfile('cvUrl', value)} /><Field label="GitHub URL" value={content.profile.github} onChange={(value) => updateProfile('github', value)} /><Field label="LinkedIn URL" value={content.profile.linkedin} onChange={(value) => updateProfile('linkedin', value)} /></div></section>
          )}

          {activeTab === 'projects' && (
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Case studies</span><h2>Projects</h2><p>Add, edit, feature, and reorder the work shown on your portfolio.</p></div><button type="button" className="admin-button admin-button-primary" onClick={() => { const item: Project = { id: newId('project'), title: 'New project', description: '', category: '', year: new Date().getFullYear().toString(), tags: [], imageUrl: '', galleryImages: [], githubUrl: '', demoUrl: '', featured: false }; update({ ...content, projects: [item, ...content.projects] }); setOpenId(item.id); }}><Plus />Add project</button></div><div className="editor-list">{content.projects.map((project, index) => <EditorCard key={project.id} title={project.title} subtitle={`${project.category || 'Uncategorized'} · ${project.featured ? 'Featured' : 'Archive'}`} open={openId === project.id} onToggle={() => setOpenId(openId === project.id ? '' : project.id)} onDelete={() => update({ ...content, projects: content.projects.filter((item) => item.id !== project.id) })} onMoveUp={() => update({ ...content, projects: move(content.projects, index, -1) })} onMoveDown={() => update({ ...content, projects: move(content.projects, index, 1) })}>
              <div className="admin-form-grid"><Field label="Project title" value={project.title} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, title: value } : item) })} /><Field label="Category" value={project.category} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, category: value } : item) })} /><Field label="Year" value={project.year} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, year: value } : item) })} /><label className="admin-check"><input type="checkbox" checked={project.featured} onChange={(event) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, featured: event.target.checked } : item) })} /><span><strong>Feature on homepage</strong><small>Featured projects appear first.</small></span></label><div className="span-2"><Textarea label="Description" value={project.description} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, description: value } : item) })} /></div><div className="span-2"><StringList label="Technologies / tags" values={project.tags} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, tags: value } : item) })} /></div><div className="span-2"><ImageField label="Cover image" value={project.imageUrl} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, imageUrl: value } : item) })} onUpload={uploadImage} /></div><div className="span-2"><StringList label="Gallery image URLs" values={project.galleryImages} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, galleryImages: value } : item) })} placeholder="/image-one.png, /image-two.png" /></div><Field label="Live URL" value={project.demoUrl} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, demoUrl: value } : item) })} /><Field label="GitHub URL" value={project.githubUrl} onChange={(value) => update({ ...content, projects: content.projects.map((item) => item.id === project.id ? { ...item, githubUrl: value } : item) })} /></div>
            </EditorCard>)}</div></section>
          )}

          {activeTab === 'experience' && (
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Professional journey</span><h2>Experience</h2><p>Manage roles, outcomes, technologies, and supporting images.</p></div><button type="button" className="admin-button admin-button-primary" onClick={() => { const item: ExperienceItem = { id: newId('experience'), role: 'New role', company: '', period: '', location: '', description: '', skills: [], imageUrl: '' }; update({ ...content, experience: [item, ...content.experience] }); setOpenId(item.id); }}><Plus />Add experience</button></div><div className="editor-list">{content.experience.map((item, index) => <EditorCard key={item.id} title={item.role} subtitle={`${item.company || 'Company'} · ${item.period || 'Dates'}`} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? '' : item.id)} onDelete={() => update({ ...content, experience: content.experience.filter((entry) => entry.id !== item.id) })} onMoveUp={() => update({ ...content, experience: move(content.experience, index, -1) })} onMoveDown={() => update({ ...content, experience: move(content.experience, index, 1) })}>
              <div className="admin-form-grid"><Field label="Role / position" value={item.role} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, role: value } : entry) })} /><Field label="Company" value={item.company} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, company: value } : entry) })} /><Field label="Period" value={item.period} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, period: value } : entry) })} /><Field label="Location" value={item.location} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, location: value } : entry) })} /><div className="span-2"><Textarea label="What you did" value={item.description} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, description: value } : entry) })} /></div><div className="span-2"><StringList label="Skills" values={item.skills} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, skills: value } : entry) })} /></div><div className="span-2"><ImageField label="Optional company or work image" value={item.imageUrl} onChange={(value) => update({ ...content, experience: content.experience.map((entry) => entry.id === item.id ? { ...entry, imageUrl: value } : entry) })} onUpload={uploadImage} /></div></div>
            </EditorCard>)}</div></section>
          )}

          {activeTab === 'education' && (
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Qualifications</span><h2>Education</h2><p>Add degrees, courses, certifications, institutions, and images.</p></div><button type="button" className="admin-button admin-button-primary" onClick={() => { const item: EducationItem = { id: newId('education'), degree: 'New qualification', institution: '', period: '', description: '', imageUrl: '' }; update({ ...content, education: [item, ...content.education] }); setOpenId(item.id); }}><Plus />Add education</button></div>{content.education.length === 0 && <div className="empty-state"><GraduationCap /><h3>No education added yet</h3><p>Add your degree, university, bootcamp, certification, or professional course.</p></div>}<div className="editor-list">{content.education.map((item, index) => <EditorCard key={item.id} title={item.degree} subtitle={`${item.institution || 'Institution'} · ${item.period || 'Dates'}`} open={openId === item.id} onToggle={() => setOpenId(openId === item.id ? '' : item.id)} onDelete={() => update({ ...content, education: content.education.filter((entry) => entry.id !== item.id) })} onMoveUp={() => update({ ...content, education: move(content.education, index, -1) })} onMoveDown={() => update({ ...content, education: move(content.education, index, 1) })}>
              <div className="admin-form-grid"><Field label="Degree / qualification" value={item.degree} onChange={(value) => update({ ...content, education: content.education.map((entry) => entry.id === item.id ? { ...entry, degree: value } : entry) })} /><Field label="Institution" value={item.institution} onChange={(value) => update({ ...content, education: content.education.map((entry) => entry.id === item.id ? { ...entry, institution: value } : entry) })} /><Field label="Period" value={item.period} onChange={(value) => update({ ...content, education: content.education.map((entry) => entry.id === item.id ? { ...entry, period: value } : entry) })} /><div /><div className="span-2"><Textarea label="Description" value={item.description} onChange={(value) => update({ ...content, education: content.education.map((entry) => entry.id === item.id ? { ...entry, description: value } : entry) })} /></div><div className="span-2"><ImageField label="Certificate, campus, or institution image" value={item.imageUrl} onChange={(value) => update({ ...content, education: content.education.map((entry) => entry.id === item.id ? { ...entry, imageUrl: value } : entry) })} onUpload={uploadImage} /></div></div>
            </EditorCard>)}</div></section>
          )}

          {activeTab === 'expertise' && (
            <div className="expertise-editor"><section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Career proof</span><h2>Headline statistics</h2></div><button type="button" className="admin-button admin-button-soft" onClick={() => { const item: Stat = { value: '0+', label: 'New statistic' }; update({ ...content, stats: [...content.stats, item] }); }}><Plus />Add statistic</button></div><div className="compact-edit-grid">{content.stats.map((stat, index) => <div className="compact-edit" key={`${stat.label}-${index}`}><Field label="Value" value={stat.value} onChange={(value) => update({ ...content, stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) })} /><Field label="Label" value={stat.label} onChange={(value) => update({ ...content, stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) })} /><button type="button" onClick={() => update({ ...content, stats: content.stats.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 /></button></div>)}</div></section>
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>What you offer</span><h2>Services</h2></div><button type="button" className="admin-button admin-button-soft" onClick={() => { const item: Service = { id: newId('service'), number: String(content.services.length + 1).padStart(2, '0'), title: 'New service', description: '' }; update({ ...content, services: [...content.services, item] }); setOpenId(item.id); }}><Plus />Add service</button></div><div className="editor-list">{content.services.map((service, index) => <EditorCard key={service.id} title={service.title} subtitle={service.number} open={openId === service.id} onToggle={() => setOpenId(openId === service.id ? '' : service.id)} onDelete={() => update({ ...content, services: content.services.filter((item) => item.id !== service.id) })} onMoveUp={() => update({ ...content, services: move(content.services, index, -1) })} onMoveDown={() => update({ ...content, services: move(content.services, index, 1) })}><div className="admin-form-grid"><Field label="Number" value={service.number} onChange={(value) => update({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, number: value } : item) })} /><Field label="Title" value={service.title} onChange={(value) => update({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, title: value } : item) })} /><div className="span-2"><Textarea label="Description" value={service.description} onChange={(value) => update({ ...content, services: content.services.map((item) => item.id === service.id ? { ...item, description: value } : item) })} /></div></div></EditorCard>)}</div></section>
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Capabilities</span><h2>Skill groups</h2></div><button type="button" className="admin-button admin-button-soft" onClick={() => { const item: SkillGroup = { id: newId('skill'), title: 'New skill group', description: '', skills: [] }; update({ ...content, skillGroups: [...content.skillGroups, item] }); setOpenId(item.id); }}><Plus />Add group</button></div><div className="editor-list">{content.skillGroups.map((group, index) => <EditorCard key={group.id} title={group.title} subtitle={`${group.skills.length} skills`} open={openId === group.id} onToggle={() => setOpenId(openId === group.id ? '' : group.id)} onDelete={() => update({ ...content, skillGroups: content.skillGroups.filter((item) => item.id !== group.id) })} onMoveUp={() => update({ ...content, skillGroups: move(content.skillGroups, index, -1) })} onMoveDown={() => update({ ...content, skillGroups: move(content.skillGroups, index, 1) })}><div className="admin-form-grid"><Field label="Group title" value={group.title} onChange={(value) => update({ ...content, skillGroups: content.skillGroups.map((item) => item.id === group.id ? { ...item, title: value } : item) })} /><Field label="Short description" value={group.description} onChange={(value) => update({ ...content, skillGroups: content.skillGroups.map((item) => item.id === group.id ? { ...item, description: value } : item) })} /><div className="span-2"><StringList label="Skills" values={group.skills} onChange={(value) => update({ ...content, skillGroups: content.skillGroups.map((item) => item.id === group.id ? { ...item, skills: value } : item) })} /></div></div></EditorCard>)}</div></section></div>
          )}

          {activeTab === 'inbox' && (
            <section className="admin-panel editor-panel"><div className="editor-heading"><div><span>Contact form</span><h2>Enquiries</h2><p>Messages sent from the portfolio are saved here, even when email delivery is unavailable.</p></div></div>{messages.length === 0 && <div className="empty-state"><Inbox /><h3>Your inbox is clear</h3><p>New portfolio enquiries will appear here.</p></div>}<div className="message-list">{messages.map((message) => <article key={message.id} className={message.status === 'new' ? 'message-card is-new' : 'message-card'}><div className="message-meta"><div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div><span>{new Date(message.createdAt).toLocaleString()}</span></div><span className="message-type">{message.projectType || 'General enquiry'}</span><p>{message.message}</p><div className="message-actions"><a className="admin-button admin-button-soft" href={`mailto:${message.email}`}>Reply by email</a>{message.status === 'new' && <button className="admin-button admin-button-soft" type="button" onClick={async () => { await fetch(`/api/admin/messages?id=${encodeURIComponent(message.id)}`, { method: 'PATCH' }); setMessages(messages.map((item) => item.id === message.id ? { ...item, status: 'read' } : item)); }}>Mark as read</button>}<button className="admin-button admin-button-danger" type="button" onClick={async () => { await fetch(`/api/admin/messages?id=${encodeURIComponent(message.id)}`, { method: 'DELETE' }); setMessages(messages.filter((item) => item.id !== message.id)); }}><Trash2 />Delete</button></div></article>)}</div></section>
          )}
        </div>
      </main>
    </div>
  );
}

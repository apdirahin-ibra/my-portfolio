export interface Profile {
  name: string;
  shortName: string;
  eyebrow: string;
  headline: string;
  role: string;
  intro: string;
  bio: string;
  portrait: string;
  availability: string;
  email: string;
  phone: string;
  location: string;
  cvUrl: string;
  whatsapp: string;
  github: string;
  linkedin: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  tags: string[];
  imageUrl: string;
  galleryImages: string[];
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  imageUrl: string;
}

export interface PortfolioContent {
  profile: Profile;
  stats: Stat[];
  services: Service[];
  skillGroups: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  status: 'new' | 'read';
  createdAt: string;
}

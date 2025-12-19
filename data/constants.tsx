import { Project, ExperienceItem, SkillCategory, SocialLink } from './types';
import { Code2, Brain, ShieldCheck, Github, Linkedin, Mail, MessageCircle, Users } from 'lucide-react';

export const PERSONAL_INFO = {
  name: "Abdirahin Ibrahim Mowliid",
  headline: "Crafting AI-Driven Digital Solutions",
  title: "Web Developer | AI & Machine Learning Engineer | IT Specialist",
  email: "apdirahiimipraahim@gmail.com",
  phone: "+252 61 770 5363",
  location: "Mogadishu, Somalia",
  bio: "I build future-ready web applications by combining scalable front-end development, intelligent machine learning solutions, and secure IT infrastructure.",
  stats: {
    projects: "30+",
    experience: "3+ Yrs",
    clients: "20+"
  }
};

export const NAV_LINKS = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Web Development',
    icon: Code2,
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'WordPress'],
    color: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'AI & Machine Learning',
    icon: Brain,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Generative AI', 'NLP', 'Computer Vision', 'Scikit-learn', 'Pandas'],
    color: 'text-purple-600 bg-purple-50',
  },
  {
    title: 'IT Specialist',
    icon: ShieldCheck,
    skills: ['Networking', 'Linux', 'Cybersecurity', 'System Admin', 'Bash Scripting', 'Cloud Services', 'Troubleshooting', 'Database Mgmt'],
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    title: 'Soft Skills',
    icon: Users,
    skills: ['Communication', 'Problem Solving', 'Critical Thinking', 'Team Collaboration', 'Time Management', 'Adaptability', 'Attention to Detail', 'Leadership', 'Client Communication'],
    color: 'text-emerald-600 bg-emerald-50',
  },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'News Classification Using ML',
    description: 'A machine learning system designed to categorize news articles into various topics automatically, enhancing content organization and retrieval.',
    tags: ['Machine Learning', 'NLP', 'Python', 'Classification'],
    imageUrl: '/images/newsimages/image1.png',
    galleryImages: [
      '/images/newsimages/image1.png',
      '/images/newsimages/image2.png',
      '/images/newsimages/image3.png',
      '/images/newsimages/image4.png',
      '/images/newsimages/image5.png',
      '/images/newsimages/image6.png',
      '/images/newsimages/imag.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '2',
    title: 'SNWO Web',
    description: 'Official website for the Somali National Women Organization, featuring event management, resource distribution, and community engagement tools.',
    tags: ['Web Development', 'PHP', 'WordPress', 'Community'],
    imageUrl: '/images/snwoimages/image.png',
    galleryImages: [
      '/images/snwoimages/image.png',
      '/images/snwoimages/image1.png',
      '/images/snwoimages/image2.png',
      '/images/snwoimages/image3.png',
      '/images/snwoimages/image4.png'
    ],
    githubUrl: '#',
    demoUrl: 'https://snwo.so/',
  },
  {
    id: '2.5',
    title: 'Kunshilin',
    description: 'A dynamic web platform for Kunshilin, built with WordPress and Elementor for a professional and customizable user experience.',
    tags: ['WordPress', 'Elementor', 'Web Development', 'PHP'],
    imageUrl: '/images/kunshilinimages/image.png',
    galleryImages: [
      '/images/kunshilinimages/image.png',
      '/images/kunshilinimages/image1.png'
    ],
    githubUrl: '#',
    demoUrl: 'https://kunshilin.so/',
  },
  {
    id: '3',
    title: 'Fake Review Detection',
    description: 'An AI-powered system to identify and filter out fake product reviews, ensuring authenticity and trust in e-commerce platforms.',
    tags: ['Machine Learning', 'Fraud Detection', 'Python', 'NLP'],
    imageUrl: '/images/fakereviewimages/image.png',
    galleryImages: [
      '/images/fakereviewimages/image.png',
      '/images/fakereviewimages/image1.png',
      '/images/fakereviewimages/image2.png',
      '/images/fakereviewimages/image3.png',
      '/images/fakereviewimages/image4.png',
      '/images/fakereviewimages/image5.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '4',
    title: 'Oral Disease Detection',
    description: 'Medical diagnostic tool utilizing machine learning to identify various oral diseases from clinical images for early intervention.',
    tags: ['Healthcare', 'Machine Learning', 'Image Processing', 'Medical AI'],
    imageUrl: '/images/OralDiseaseimages/image.png',
    galleryImages: [
      '/images/OralDiseaseimages/image.png',
      '/images/OralDiseaseimages/image1.png',
      '/images/OralDiseaseimages/image2.png',
      '/images/OralDiseaseimages/image3.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '5',
    title: 'Mental Health Recommendations',
    description: 'A recommendation system that analyzes user inputs to suggest personalized mental health resources and coping strategies.',
    tags: ['Healthcare', 'NLP', 'Machine Learning', 'Recommendation System'],
    imageUrl: '/images/mentalhealthimages/image.png',
    galleryImages: [
      '/images/mentalhealthimages/image.png',
      '/images/mentalhealthimages/image1.png',
      '/images/mentalhealthimages/image2.png',
      '/images/mentalhealthimages/image3.png',
      '/images/mentalhealthimages/image5.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '6',
    title: 'Customer Retention Prediction',
    description: 'Predictive analytics model to forecast customer churn and retention rates, helping businesses optimize their engagement strategies.',
    tags: ['Business Intelligence', 'Machine Learning', 'Data Analytics', 'Prediction'],
    imageUrl: '/images/customerretentionimages/image.png',
    galleryImages: [
      '/images/customerretentionimages/image.png',
      '/images/customerretentionimages/image1.png',
      '/images/customerretentionimages/image2.png',
      '/images/customerretentionimages/image3.png',
      '/images/customerretentionimages/image4.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '7',
    title: 'Glaucoma Prediction',
    description: 'Advanced diagnostic system using Convolutional Neural Networks (CNN) to detect glaucoma from optical nerve scans with high accuracy.',
    tags: ['Medical AI', 'Deep Learning', 'CNN', 'Computer Vision'],
    imageUrl: '/images/glaucomaimages/image.png',
    galleryImages: [
      '/images/glaucomaimages/image.png',
      '/images/glaucomaimages/image1.png',
      '/images/glaucomaimages/image2.png',
      '/images/glaucomaimages/image3.png',
      '/images/glaucomaimages/image4.png',
      '/images/glaucomaimages/image5.png',
      '/images/glaucomaimages/image6.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: '8',
    title: 'Identifying Fraudulent Job Advertisements',
    description: 'A machine learning system to detect and flag fraudulent job postings, protecting job seekers from scams.',
    tags: ['Machine Learning', 'Fraud Detection', 'NLP', 'Python'],
    imageUrl: '/images/Identifyingjopsimages/image.png',
    galleryImages: [
      '/images/Identifyingjopsimages/image.png',
      '/images/Identifyingjopsimages/image1.png',
      '/images/Identifyingjopsimages/image2.png'
    ],
    githubUrl: '#',
    demoUrl: '#',
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: '1',
    title: 'Machine Learning Engineer',
    company: 'Setsom Institute for Robotics Engineering and Technology',
    period: 'Jun 2024 - Present',
    description: 'Developed and deployed machine learning models for data-driven applications, focusing on predictive analytics, classification, and automation. Worked with Python, TensorFlow, and Scikit-Learn to build AI solutions. Designed and optimized machine learning pipelines, integrated models into web applications using Flask/Django, and managed databases with PostgreSQL. Collaborated with cross-functional teams to deliver AI-powered solutions.',
    skills: ['Python', 'TensorFlow', 'Scikit-Learn', 'NLP'],
  },
  {
    id: '2',
    title: 'Freelance Web Developer',
    company: 'kunshilin.so',
    period: 'Nov 2024 - jan 2025',
    description: 'Responsible for developing and maintaining web applications, optimizing website performance, and implementing security measures. Proficient in front-end and back-end technologies, including HTML, CSS, JavaScript, Flask, and PostgreSQL. Worked on AI-based applications, database management, and UI/UX enhancements.',
    skills: ['React', 'Flask', 'PostgreSQL', 'AI'],
  },
  {
    id: '3',
    title: 'IT & Web Developer Specialist',
    company: 'Somali National Women Organization',
    period: 'Oct 2023 - Jan 2025',
    description: 'Handled all aspects of IT and web development, including website design, backend development, server management, and troubleshooting technical issues. Developed and maintained web applications, ensured cybersecurity best practices, and provided IT support to optimize business operations. Managed databases and cloud services.',
    skills: ['PHP', 'WordPress', 'IT Support', 'Security'],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com/harazi3868', icon: Github },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/abdirahin-ibarahim-mowliid-b18277326', icon: Linkedin },
];
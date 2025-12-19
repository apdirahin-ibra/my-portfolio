import React, { useState, useEffect, useRef } from 'react';
import Section from './Section';
import { PROJECTS } from '../data/constants';
import { Project } from '../data/types';
import { Github, ExternalLink, ArrowRight, X, ChevronLeft, ChevronRight, ImageIcon, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = selectedProject
    ? (selectedProject.galleryImages && selectedProject.galleryImages.length > 0
      ? selectedProject.galleryImages
      : [selectedProject.imageUrl])
    : [];

  useEffect(() => {
    if (selectedProject) {
      setCurrentImageIndex(0);
      setIsZoomed(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Reset scroll when image changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentImageIndex]);

  // Keyboard Navigation
  useEffect(() => {
    if (!selectedProject) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsZoomed(false);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setIsZoomed(false);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, images.length]);

  const handleDemoClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    setIsZoomed(false);
    setSelectedProject(project);
  };

  const closeLoop = () => setSelectedProject(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isZoomed && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    setIsZoomed(!isZoomed);
  };

  return (
    <Section
      id="projects"
      className="bg-white"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Featured Projects</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Showcasing real-world applications and innovative solutions.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] hover:border-slate-200 transition-all duration-300 ease-in-out cursor-default"
          >
            {/* Image Header with simple dots decor */}
            <div className="bg-slate-50 p-2 pb-0 border-b border-slate-100">
              <div className="flex gap-1.5 px-2 py-2">
                <div className="w-2 h-2 rounded-full bg-red-400/60"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400/60"></div>
                <div className="w-2 h-2 rounded-full bg-green-400/60"></div>
              </div>
              <div className="relative h-48 overflow-hidden rounded-t-lg group-hover:opacity-90 transition-opacity cursor-pointer" onClick={(e) => handleDemoClick(e, project)}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm mb-6 flex-grow leading-relaxed line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-auto border-t border-slate-100 pt-4">


                <button
                  onClick={(e) => handleDemoClick(e, project)}
                  className="flex items-center text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors gap-1 outline-none focus:text-primary-600"
                >
                  {project.galleryImages && project.galleryImages.length > 0 ? <ImageIcon size={14} /> : <ExternalLink size={14} />}
                  Preview
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Futuristic Command Interface Modal (Light/Lab Theme) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-100/80 backdrop-blur-md"
            onClick={closeLoop}
          >
            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl h-[85vh] flex flex-col md:flex-row bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={closeLoop}
                className="absolute top-0 right-0 z-50 p-4 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-bl-xl"
              >
                <X size={24} />
              </button>

              {/* LEFT: Digital Viewport */}
              <div className="w-full h-[40%] md:h-full md:w-[60%] relative flex flex-col bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200">
                {/* Viewport UI Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 p-4 md:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-cyan-600 font-bold tracking-widest bg-cyan-50 px-2 py-0.5 rounded-sm border border-cyan-100">CAM_0{currentImageIndex + 1} // LIVE_FEED</span>
                    <div className="w-20 h-px bg-cyan-200" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-4 h-4 border-l-2 border-b-2 border-cyan-500/30" />
                    <div className="w-4 h-4 border-r-2 border-b-2 border-cyan-500/30" />
                  </div>
                </div>

                <div className="relative flex-grow flex items-center justify-center p-2 md:p-12 overflow-hidden group">
                  <div
                    ref={containerRef}
                    className="relative w-full h-full flex items-center justify-center transition-all duration-300"
                    onClick={toggleZoom}
                  >
                    {images.length > 0 && (
                      <img
                        src={images[currentImageIndex]}
                        alt="Project Feed"
                        className={`max-h-full w-auto object-contain cursor-zoom-in transition-transform duration-500 ${isZoomed ? 'scale-110' : 'scale-100'}`}
                        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
                      />
                    )}
                  </div>

                  {/* Navigation Arrows (Clean Style) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all rounded-full shadow-sm hover:shadow-md backdrop-blur-sm"
                      >
                        <ChevronLeft size={28} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all rounded-full shadow-sm hover:shadow-md backdrop-blur-sm"
                      >
                        <ChevronRight size={28} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="h-16 border-t border-slate-200 bg-white flex items-center justify-center gap-2 px-4 z-20">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); setIsZoomed(false); }}
                        className={`relative h-10 w-14 overflow-hidden border rounded-md transition-all ${currentImageIndex === idx
                          ? 'border-cyan-500 opacity-100 ring-2 ring-cyan-100'
                          : 'border-slate-200 opacity-50 hover:opacity-100 hover:border-slate-400'
                          }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT: Data Interface */}
              <div className="w-full h-[60%] md:h-full md:w-[40%] flex flex-col bg-white overflow-y-auto custom-scrollbar relative">

                <div className="p-8 md:p-10 flex flex-col h-full">

                  {/* Header Data */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div className="text-slate-400 text-[10px] font-mono tracking-widest uppercase">
                        Active Project
                      </div>
                    </div>
                    <div className="h-px bg-slate-100 flex-grow" />
                    <span className="text-[10px] font-mono text-slate-300">ID: {selectedProject.id}</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                    {selectedProject.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono font-medium text-slate-600 border border-slate-200 px-2 py-1 bg-slate-50 rounded-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm md:text-base border-l-2 border-cyan-500/30 pl-4 mb-8">
                    {selectedProject.description}
                  </p>

                  {/* System Diagnostics Box */}
                  <div className="mt-auto bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                      System Performance
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span>Optimization</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-[98%] h-full bg-emerald-500" />
                          </div>
                          <span className="text-emerald-600 tabular-nums">98%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                        <span>Accessibility</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-[100%] h-full bg-cyan-500" />
                          </div>
                          <span className="text-cyan-600 tabular-nums">100%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Module */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProject.demoUrl && selectedProject.demoUrl !== '#' && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <span>Live</span>
                        <ExternalLink size={14} />
                      </a>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeLoop();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 py-3 px-4 font-bold text-xs uppercase tracking-wider transition-all rounded-lg border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                    >
                      <span>Launch Project</span>
                      <Rocket size={14} />
                    </button>
                  </div>

                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
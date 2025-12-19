import React from 'react';
import Section from './Section';
import { SKILL_CATEGORIES } from '../data/constants';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  return (
    <Section
      id="skills"
      className="bg-slate-50"
    >
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Technical Expertise</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Expertise spanning multiple technology stacks and frameworks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILL_CATEGORIES.map((category, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-slate-50 text-primary-600`}>
              <category.icon size={24} />
            </div>

            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 whitespace-nowrap">{category.title}</h3>

            <ul className="space-y-3">
              {category.skills.map((skill) => (
                <li key={skill} className="flex items-center text-slate-600 text-sm font-medium">
                  <span className={`w-1.5 h-1.5 rounded-full mr-3 ${idx === 0 || idx === 1 ? 'bg-blue-500' : 'bg-green-500'
                    }`}></span>
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Skills;
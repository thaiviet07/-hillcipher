/**
 * AboutPage — Premium educational landing page
 */
import React from 'react';
import { motion } from 'framer-motion';

const FeatureItem = ({ icon, title, desc, color }: { icon: string, title: string, desc: string, color: string }) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', boxShadow: '0 1px 2px rgba(60,64,67,0.1)' }}>
    <div style={{ width: 40, height: 40, borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#202124' }}>{title}</h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '4rem', maxWidth: 1000, margin: '0 auto', paddingBottom: '4rem' }}
    >
      {/* Hero Section */}
      <section style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <motion.h1 
          variants={itemVariants}
          style={{ fontSize: '3.5rem', fontWeight: 500, fontFamily: 'var(--font-display)', marginBottom: '1.5rem', background: 'linear-gradient(90deg, #4285F4, #34A853, #FBBC05, #EA4335)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Hill Cipher Studio
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: 800, margin: '0 auto', lineHeight: 1.6 }}
        >
          An interactive laboratory for matrix-based cryptography and linear algebra education.
        </motion.p>
      </section>

      {/* Grid Features */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <motion.div variants={itemVariants}>
          <FeatureItem 
            icon="Σ" 
            title="Matrix Mathematics" 
            desc="Explore modular matrix operations including determinants, adjugates, and modular inverses with real-time feedback." 
            color="#4285F4" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FeatureItem 
            icon="🔓" 
            title="Security Analysis" 
            desc="Understand modern vulnerabilities through guided Known-Plaintext Attack simulations and algorithm comparisons." 
            color="#EA4335" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FeatureItem 
            icon="🎓" 
            title="Interactive Academy" 
            desc="Master concepts through visual labs like the Modular Clock, Vector Mapping, and Step-by-Step walkthroughs." 
            color="#34A853" 
          />
        </motion.div>
      </section>

      {/* Technical Narrative */}
      <motion.section 
        variants={itemVariants}
        style={{ background: '#FFFFFF', border: '1px solid #DADCE0', borderRadius: '16px', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
      >
        <div style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 500, marginBottom: '1rem' }}>The Intersection of Math & Code</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.125rem' }}>
            Hill Cipher Studio was developed as a case study in creating high-fidelity educational software. 
            The core engine is built using **Test-Driven Development (TDD)**, ensuring that complex modular 
            arithmetic remains 100% accurate across all matrix transformations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reliability</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>44 Unit Tests</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--google-green)' }}>100% Coverage</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Rendering</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>KaTeX Engine</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--google-blue)' }}>LaTeX Fidelity</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>State</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Zustand</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--google-yellow)' }}>Reactive Logic</div>
          </div>
        </div>
      </motion.section>

      {/* Footer / Tech Stack */}
      <motion.section variants={itemVariants} style={{ textAlign: 'center', borderTop: '1px solid #DADCE0', paddingTop: '3rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Built with Modern Web Technologies</div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['React 18', 'TypeScript', 'Vite', 'Framer Motion', 'Tailwind CSS', 'KaTeX'].map(tech => (
            <div key={tech} style={{ padding: '6px 16px', background: '#F1F3F4', borderRadius: '24px', fontSize: '0.75rem', fontWeight: 600, color: '#5F6368' }}>{tech}</div>
          ))}
        </div>
        <div style={{ marginTop: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Linear Algebra Final Project — Version 1.0.0
        </div>
      </motion.section>
    </motion.div>
  );
};

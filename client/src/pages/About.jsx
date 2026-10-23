import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ProudAssociation } from '../components/ProudAssociation';

export const About = () => {
  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div style={{ textTransform: 'uppercase', color: '#60a5fa', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
            About DigitalNext India
          </div>
          <h1>India's Premier Visual and Surveillance Partner</h1>
          <p>
            Widely recognized across North India as "CCTV Wale & Projector Wale": delivering high-definition projection, interactive classrooms, and multi-channel enterprise security.
          </p>
        </div>
      </section>

      {/* Main Story Content */}
      <div className="container">
        <div className="about-grid-content">
          <div>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Our Story & Commitment
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#0f172a', fontWeight: 700, margin: '0.5rem 0 1.2rem', lineHeight: 1.2 }}>
              Dedicated to Precision Tech, Transparent Pricing, and Lifetime Support
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.2rem' }}>
              Welcome to <strong>DigitalNext</strong>, your one-stop destination for all your visual, surveillance, and electronic needs. We are deeply passionate about providing high-quality electronic products, including a comprehensive range of CCTV cameras and accessories, LCD panels and projector equipment, 4K interactive smart flat panels, covert security gear, and high-speed computer storage.
            </p>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Our experienced engineering team is dedicated to offering exceptional customer service, tailored recommendations, and hands-on technical guidance to help educational institutions, commercial offices, and homeowners find the ideal solution.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle2 size={18} color="#2563eb" />
                <span>100% Genuine Tech</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle2 size={18} color="#2563eb" />
                <span>GST Invoicing & Bulk Supply</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle2 size={18} color="#2563eb" />
                <span>Official Brand Warranties</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a', fontWeight: 600, fontSize: '0.92rem' }}>
                <CheckCircle2 size={18} color="#2563eb" />
                <span>Pan-India Onsite Assistance</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '2.5rem', color: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '1rem', color: '#60a5fa' }}>
              CCTV Wale & Projector Wale
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              From individual homeowner setups to 500+ seat university auditoriums, our technical team provides end-to-end consultancy, deployment, and maintenance.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderTop: '1px solid #1e293b', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>5,000+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Successful Projector & CCTV Installations</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>50+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Premier Colleges, Schools & Hospitals Partnered</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Original Brand Guaranteed Hardware</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link to="/contact" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Connect with our Experts</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Client Logos */}
      <ProudAssociation />
    </div>
  );
};

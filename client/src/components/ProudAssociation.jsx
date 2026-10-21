import React from 'react';
import { CLIENT_LOGOS } from '../data/products';
import { InfiniteMovingCards } from './InfiniteMovingCards';

export const ProudAssociation = () => {
  return (
    <section className="clients-section" id="proud-association-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--color-soft-blue)', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0.25rem 0.75rem', borderRadius: '4px', marginBottom: '0.6rem' }}>
            Trusted Partnerships
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-heading)', fontWeight: 800 }}>
            Proud Associations
          </h2>
          <p style={{ color: 'var(--color-body)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '640px', margin: '0.35rem auto 0' }}>
            Technology partner for universities, premier healthcare institutions, and educational schools across India.
          </p>
        </div>
      </div>

      {/* Infinite moving ribbon with gradient masks */}
      <div className="infinite-cards-wrapper">
        <InfiniteMovingCards
          items={CLIENT_LOGOS}
          direction="left"
          speed="normal"
          pauseOnHover={true}
        />
      </div>
    </section>
  );
};

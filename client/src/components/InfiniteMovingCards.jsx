import React, { useEffect, useRef, useState } from 'react';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className = ''
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      // Clone each card to create an unbroken seamless loop
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      // Direction setting
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards');
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse');
      }

      // Speed duration setting
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }

      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={`infinite-scroller-container ${className}`}
    >
      <ul
        ref={scrollerRef}
        className={`infinite-scroller-track ${start ? 'animate-scroll' : ''} ${
          pauseOnHover ? 'pause-on-hover' : ''
        }`}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            className="infinite-logo-card"
            title={item.name}
          >
            <div className="infinite-logo-image-box">
              <img
                src={item.logo}
                alt={item.name}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<span class="fallback-name">${item.name}</span>`;
                }}
              />
            </div>
            <span className="infinite-logo-name">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

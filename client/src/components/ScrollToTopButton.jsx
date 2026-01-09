// client/src/components/ScrollToTopButton.jsx
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import styles from './Footer.module.css';
import './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="scroll-to-top-button"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '1000',
        border: 'none',
        background: 'none',
        padding: 0,
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
        transition: 'opacity 0.4s ease, visibility 0.4s ease',
      }}
      aria-label="Наверх"
      title="Наверх"
    >
      <div className={show ? 'pulse-grow' : ''}>
        <Button
          icon="pi pi-chevron-up"
          rounded
          pt={{
            root: {
              style: {
                width: '44px',
                height: '44px',
                backgroundColor: 'white',
                color: '#5a4a42',
                boxShadow: '0 4px 12px rgba(90, 74, 66, 0.1)',
                transition: 'all 0.4s ease',
                border: '1px solid #e8e5e0',
              }
            }
          }}
          className={`${styles['social-button']} scroll-button`}
        />
      </div>
    </button>
  );
};

export default ScrollToTopButton;

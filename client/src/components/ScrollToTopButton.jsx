import { Button } from 'primereact/button';
import React, { useState, useEffect } from 'react';
import styles from './ScrollToTopButton.module.css';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      icon="pi pi-chevron-up"
      rounded
      pt={{
        root: {
          style: {
            position: 'fixed',
            bottom: '30px',
            left: 'calc(100vw - 70px)',
            right: 'auto !important',
            zIndex: '1000',
            width: '44px',
            height: '44px',
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden',
            transition: 'all 0.3s ease',
            padding: '0'
          }
        }
      }}
      onClick={scrollToTop}
      aria-label="Наверх"
      title="Наверх"
      className={styles['scroll-to-top-button']}
    />
  );
};

export default ScrollToTopButton;
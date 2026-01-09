import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import './ScrollToTopButton.css';

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
            right: '30px',
            zIndex: '1000',
            width: '44px',
            height: '44px',
            backgroundColor: 'white',
            color: '#5a4a42',
            transition: 'all 0.3s ease',
            border: '1px solid #d9d3ce',
            opacity: isVisible ? 1 : 0,
            visibility: isVisible ? 'visible' : 'hidden'
          }
        }
      }}
      className="scroll-to-top-button pulse-grow scroll-button"
      onClick={scrollToTop}
      aria-label="Наверх"
      title="Наверх"
    />
  );
};

export default ScrollToTopButton;
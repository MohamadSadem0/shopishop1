import { useState, useEffect } from 'react';
import { debounce } from 'lodash'; // or your preferred debounce implementation

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 250); // Adjust debounce time as needed

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      handleResize.cancel();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
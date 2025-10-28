import { useState, useEffect } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between py-6">
          {/* Logo/Name */}
          <a 
            href="#top" 
            className="text-xl tracking-tight hover:opacity-60 transition-opacity"
          >
            PAUL JEON
          </a>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <a 
              href="#about" 
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              ABOUT
            </a>
            <a 
              href="#work" 
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              WORK
            </a>
            <a 
              href="#resume" 
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              RESUME
            </a>
            <a 
              href="#contact" 
              className="text-sm tracking-wide hover:opacity-60 transition-opacity"
            >
              CONTACT
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For home page, use anchor links; for other pages, use route links
  const isHomePage = location.pathname === '/';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-center justify-between py-6">
          {/* Logo/Name */}
          <Link 
            to="/" 
            className="text-xl tracking-tight hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            PAUL JEON
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            {isHomePage ? (
              <>
                <a 
                  href="#about" 
                  className="text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  ABOUT
                </a>
                <a 
                  href="#work" 
                  className="text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  WORK
                </a>
                <a 
                  href="#resume" 
                  className="text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  RESUME
                </a>
                <a 
                  href="#contact" 
                  className="text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  CONTACT
                </a>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className={`text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded ${
                    location.pathname === '/about' ? 'opacity-100' : ''
                  }`}
                >
                  ABOUT
                </Link>
                <Link 
                  to="/work" 
                  className={`text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded ${
                    location.pathname === '/work' ? 'opacity-100' : ''
                  }`}
                >
                  WORK
                </Link>
                <Link 
                  to="/#resume" 
                  className="text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  RESUME
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-sm tracking-wide hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded ${
                    location.pathname === '/contact' ? 'opacity-100' : ''
                  }`}
                >
                  CONTACT
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

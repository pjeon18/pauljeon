import { useEffect, useRef, useState } from 'react';
import { Mail, Linkedin, Instagram, Github, Twitter } from 'lucide-react';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-8 lg:px-16 py-32"
    >
      <div className="max-w-7xl w-full">
        <div 
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="text-sm tracking-widest text-gray-500 mb-8">CONTACT</h2>
          <h3 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-8">
            Let's work<br />together
          </h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects and opportunities.
          </p>
        </div>

        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-200 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <a 
            href="mailto:paul.jeon@email.com"
            className="group flex flex-col items-center justify-center p-8 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <Mail className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm tracking-wide">EMAIL</span>
          </a>

          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <Linkedin className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm tracking-wide">LINKEDIN</span>
          </a>

          <a 
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <Instagram className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm tracking-wide">INSTAGRAM</span>
          </a>

          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <Github className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm tracking-wide">GITHUB</span>
          </a>

          <a 
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300"
          >
            <Twitter className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm tracking-wide">TWITTER</span>
          </a>
        </div>

        <div 
          className={`mt-32 text-center text-sm text-gray-500 transition-all duration-1000 delay-400 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <p>© 2024 Paul Jeon. All rights reserved.</p>
          <p className="mt-2">Designed & developed with care.</p>
        </div>
      </div>
    </section>
  );
}

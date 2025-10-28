import { useEffect, useRef, useState } from 'react';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
      id="about" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center px-8 lg:px-16 pt-32 pb-24"
    >
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Text Content */}
          <div 
            className={`space-y-8 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div>
              <h2 className="text-sm tracking-widest text-gray-500 mb-4">ABOUT</h2>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl leading-tight mb-8">
                Designer &<br />
                Creative<br />
                Developer
              </h1>
            </div>
            
            <div className="space-y-6 text-lg text-gray-700 max-w-xl">
              <p>
                I'm a multidisciplinary designer and developer focused on creating 
                meaningful digital experiences that bridge the gap between form and function.
              </p>
              <p>
                With a background in both design and engineering, I approach problems 
                holistically, ensuring that every pixel serves a purpose and every 
                interaction feels intentional.
              </p>
              <p>
                Currently exploring the intersection of AI, design systems, and 
                interactive storytelling.
              </p>
            </div>


          </div>

          {/* Image/Visual */}
          <div 
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-gray-400 rounded-full opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

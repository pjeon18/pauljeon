import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../content/projects';
import { Typewriter } from './ui/Typewriter';

export function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
    <>
      <section 
        id="work" 
        ref={sectionRef}
        className="min-h-screen px-6 sm:px-8 lg:px-16 py-24 sm:py-32 scroll-mt-20"
      >
        <div className="w-full max-w-[1400px] mx-auto">
          <div 
            className={`mb-12 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="mb-8">
              <h2 className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight">
                <Typewriter text="Recent Projects" speed={22} />
              </h3>
            </div>
          </div>

          {/* Project Cards - Minimal grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="group relative block h-full border border-gray-200 rounded-xl bg-white hover:border-black hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex flex-col h-full p-6 gap-4">
                  <div className="flex items-center justify-between text-xs tracking-widest text-gray-500">
                    <span>{project.role}</span>
                    {project.timeframe && <span className="text-gray-400">{project.timeframe}</span>}
                  </div>
                  <h4 className="text-2xl lg:text-3xl leading-snug group-hover:translate-x-1 transition-transform duration-300">
                    {project.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    {project.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-600">View project</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

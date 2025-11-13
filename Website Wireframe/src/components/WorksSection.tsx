import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../content/projects';

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
        className="min-h-screen px-8 lg:px-16 py-32 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className={`mb-12 transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="mb-8">
              <h2 className="text-sm tracking-widest text-gray-500 mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl lg:text-5xl">Recent Projects</h3>
            </div>
          </div>

          {/* Project Cards - Text Only */}
          <div className="space-y-4">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className={`block w-full text-left border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300 p-6 group ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs tracking-wider text-gray-500 mb-1">{project.role}</p>
                    <h4 className="text-xl lg:text-2xl mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {project.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {project.summary}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:ml-4">
                    {project.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 border border-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
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

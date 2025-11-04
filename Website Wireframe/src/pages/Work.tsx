import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { projects } from '../content/projects';

export default function Work() {
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
      <Header />
      <main>
        <section 
          ref={sectionRef}
          className="min-h-screen px-8 lg:px-16 py-32 scroll-mt-20"
        >
          <div className="max-w-7xl mx-auto">
            <div 
              className={`mb-16 transition-all duration-1000 ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <h2 className="text-sm tracking-widest text-gray-500 mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl lg:text-5xl mb-4">Recent Projects</h3>
              <p className="text-lg text-gray-600 max-w-2xl">
                A collection of projects spanning design, development, and data visualization.
              </p>
            </div>

            {/* Project Cards - Text Only */}
            <div className="space-y-4">
              {projects.map((project, index) => (
                <Link
                  key={project.slug}
                  to={`/work/${project.slug}`}
                  className={`block w-full text-left border border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300 p-8 group ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <p className="text-xs tracking-wider text-gray-500 mb-1">{project.role}</p>
                        <h4 className="text-2xl lg:text-3xl mb-3 group-hover:translate-x-2 transition-transform duration-300">
                          {project.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {project.summary}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs bg-gray-100 border border-gray-300 hover:border-black transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.timeframe && (
                      <div className="text-sm text-gray-500 lg:text-right">
                        {project.timeframe}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';

type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

const experiences: Experience[] = [
  {
    title: 'Senior Product Designer',
    company: 'Tech Company',
    period: '2022 — Present',
    description: 'Leading design initiatives for core product features, establishing design systems, and mentoring junior designers.'
  },
  {
    title: 'UI/UX Designer',
    company: 'Design Studio',
    period: '2020 — 2022',
    description: 'Designed digital experiences for clients across various industries, focusing on user-centered design principles.'
  },
  {
    title: 'Junior Designer',
    company: 'Creative Agency',
    period: '2018 — 2020',
    description: 'Contributed to branding projects, website designs, and marketing campaigns for diverse clientele.'
  },
];

const skills = [
  'Product Design',
  'UI/UX Design',
  'Design Systems',
  'Prototyping',
  'Front-end Development',
  'Motion Design',
  'Brand Identity',
  'Figma',
  'React',
  'TypeScript',
];

export function ResumeSection() {
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
    <section 
      id="resume" 
      ref={sectionRef}
      className="min-h-screen px-8 lg:px-16 py-32 bg-gray-50 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        <div 
          className={`mb-20 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="text-sm tracking-widest text-gray-500 mb-4">RESUME</h2>
          <h3 className="text-4xl lg:text-5xl mb-8">Experience & Skills</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          {/* Experience */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h4 className="text-xl mb-8 tracking-wide">EXPERIENCE</h4>
              <div className="space-y-12">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1000 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="mb-2">
                      <h5 className="text-2xl mb-1">{exp.title}</h5>
                      <div className="flex items-center gap-3 text-gray-600">
                        <span>{exp.company}</span>
                        <span className="text-gray-400">•</span>
                        <span>{exp.period}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div 
            className={`transition-all duration-1000 delay-300 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <h4 className="text-xl mb-8 tracking-wide">SKILLS</h4>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white border border-gray-300 hover:border-black transition-colors duration-300"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    opacity: isVisible ? 1 : 0,
                    animation: isVisible ? `fadeInUp 0.5s ease-out forwards ${index * 50}ms` : 'none'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-12">
              <a 
                href="/resume.pdf" 
                className="inline-flex items-center gap-2 text-sm hover:gap-4 transition-all duration-300 border-b border-black pb-1"
              >
                Download Full Resume
                <span>↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

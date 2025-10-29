import { useEffect, useRef, useState } from 'react';

type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

const experiences: Experience[] = [
  {
    title: 'Procurement Manager',
    company: 'The Harvard Shop',
    period: 'September 2023 — February 2025',
    description: 'Managed warehouse inventory of $7.8M across 1100+ SKUs for three retail locations and an online store. Decreased web stockout from 5.32% to 1.90% with weekly analysis and prioritizing low inventory SKUs. Reached record-high profit margins at 65% by optimizing product outflow such as by supplier pre-ticketing. Increased revenue 47% YoY ($370K) by automating high-demand product orders via Python API integration with Lightspeed, while growing inventory 64% to $1.9M and improving margins. Maintained partnerships with brands (Nike, Champion, Patagonia, Peter Millar) to ensure quality products. Led weekly alignment meetings with the stores, marketing, product teams to coordinate new campaigns.'
  },
  {
    title: 'Marketing Analytics Intern',
    company: 'The Harvard Shop',
    period: 'June 2023 — August 2023',
    description: 'Used digital marketing tools to analyze return on ad spend on Meta and conversion/open rates of emails. Conducted user research on 150,000+ registered online customers through survey and A/B testing of email format, checkout flow, and pop-up campaigns via Klaviyo, Shopify, and Lightspeed. Designed layouts for summer email marketing campaign, generating $8,000+ in attributed campaigns. Strategized and launched SMS campaign as a final project, presenting case study to the board of directors.'
  },
  {
    title: 'Director of Growth',
    company: 'Harvard Undergraduate Marketing Group',
    period: 'September 2025 — Present',
    description: 'Secure external funding and sponsorships from local brands and companies for student-oriented marketing. Lead weekly meetings to build organizational reach to student base for Gen-Z focused marketing.'
  },
  {
    title: 'UI/UX Designer',
    company: 'Tech for Social Good',
    period: 'February 2025 — May 2025',
    description: 'Designed prototype sign-up website (lo-fi & hi-fi in Figma) for college-application mentorship nonprofit. Conducted user research via surveys and interviews; presented design iterations weekly to company board.'
  },
  {
    title: 'Design Chair',
    company: 'Harvard Korean Association',
    period: 'May 2024 — May 2025',
    description: 'Designed and published all graphics, merchandise, and brand material for Korean cultural organization. Organized marketing campaign and sponsored collaborations with 10+ global Korean brands and local restaurants for 300+ students.'
  },
];

const skills = [
  'Procurement Management',
  'Inventory Optimization',
  'Marketing Analytics',
  'UI/UX Design',
  'User Research',
  'Figma',
  'Python',
  'Data Analysis',
  'Brand Design',
  'Growth Strategy',
  'A/B Testing',
  'Email Marketing',
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

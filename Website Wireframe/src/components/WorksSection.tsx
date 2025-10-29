import { useEffect, useRef, useState } from 'react';
import { Grid3x3, List } from 'lucide-react';
import { Button } from './ui/Button';
import { ProjectModal } from './ProjectModal';

export type Project = {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  images: string[];
  details: string;
};

const projects: Project[] = [
  { 
    id: 1, 
    title: 'Brand Identity System', 
    category: 'Design', 
    year: '2024',
    description: 'A comprehensive brand identity system for a modern tech startup, including logo design, color palette, and design guidelines.',
    images: ['https://images.unsplash.com/photo-1558655146-d09347e92766?w=800', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800'],
    details: 'Created a cohesive visual language that reflects the company\'s innovative spirit while maintaining professional credibility. The system includes typography, iconography, and application guidelines.'
  },
  { 
    id: 2, 
    title: 'E-commerce Platform', 
    category: 'Development', 
    year: '2024',
    description: 'Full-stack e-commerce platform with seamless checkout experience and modern UI/UX design.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'],
    details: 'Built with React, Node.js, and Stripe integration. Features include real-time inventory management, personalized recommendations, and responsive design across all devices.'
  },
  { 
    id: 3, 
    title: 'Motion Graphics', 
    category: 'Animation', 
    year: '2023',
    description: 'Animated brand storytelling for product launches and social media campaigns.',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'],
    details: 'Dynamic motion design work incorporating 2D and 3D elements. Created engaging content that increased social media engagement by 300%.'
  },
  { 
    id: 4, 
    title: 'Mobile App Design', 
    category: 'Product', 
    year: '2023',
    description: 'User-centered mobile application design focusing on accessibility and intuitive navigation.',
    images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800'],
    details: 'Designed for both iOS and Android platforms with emphasis on user research, prototyping, and usability testing. Achieved 4.8-star rating on app stores.'
  },
  { 
    id: 5, 
    title: 'Interactive Installation', 
    category: 'Interactive', 
    year: '2023',
    description: 'Physical and digital interactive experience for a museum exhibition.',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800'],
    details: 'Combined projection mapping, motion sensors, and real-time data visualization to create an immersive experience. Engaged over 10,000 visitors.'
  },
  { 
    id: 6, 
    title: 'Editorial Layout', 
    category: 'Design', 
    year: '2022',
    description: 'Magazine layout design with focus on typography and visual hierarchy.',
    images: ['https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800', 'https://images.unsplash.com/photo-1586281380614-a05ccb0d9b4b?w=800', 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=800'],
    details: 'Designed layouts for quarterly publication featuring articles on design, technology, and culture. Established grid systems and typographic standards.'
  },
];

export function WorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
            className={`mb-12 flex items-end justify-between transition-all duration-1000 ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div>
              <h2 className="text-sm tracking-widest text-gray-500 mb-4">SELECTED WORK</h2>
              <h3 className="text-4xl lg:text-5xl">Recent Projects</h3>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-sm overflow-hidden">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-1">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`block w-full text-left border-t border-gray-200 last:border-b py-8 hover:bg-gray-50 transition-all duration-300 group ${
                    isVisible 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-sm text-gray-400">
                      {String(project.id).padStart(2, '0')}
                    </div>
                    <div className="col-span-12 lg:col-span-6">
                      <h4 className="text-2xl lg:text-3xl group-hover:translate-x-4 transition-transform duration-300">
                        {project.title}
                      </h4>
                    </div>
                    <div className="col-span-6 lg:col-span-3 text-gray-600">
                      {project.category}
                    </div>
                    <div className="col-span-5 lg:col-span-2 text-right text-gray-600">
                      {project.year}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`group relative aspect-square overflow-hidden bg-gray-100 transition-all duration-1000 hover:scale-[1.02] ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-xs tracking-wider mb-2">{project.category}</p>
                      <h4 className="text-xl mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-300">{project.year}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </>
  );
}

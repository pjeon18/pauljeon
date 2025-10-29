import { Dialog, DialogContent } from './ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import type { Project } from './WorksSection';

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (project) {
      setCurrentImageIndex(0);
    }
  }, [project]);

  if (!project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setCurrentImageIndex(0);
    }
  };

  return (
    <Dialog open={!!project} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-[95vh] p-0 gap-0 bg-white overflow-hidden rounded-lg border-0 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Image Carousel - Instagram-style */}
          <div className="lg:col-span-3 relative bg-black flex items-center justify-center h-[50vh] lg:h-full overflow-hidden">
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600/333333/FFFFFF?text=Image+Not+Available';
              }}
            />
            
            {/* Carousel Controls */}
            {project.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center transition-all z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center transition-all z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Details - Right Side */}
          <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col h-[50vh] lg:h-full overflow-y-auto bg-white">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <div className="mb-8">
                <div className="mb-6">
                  <p className="text-xs tracking-widest text-gray-500 mb-3">
                    {project.category} • {project.year}
                  </p>
                  <h2 className="text-3xl lg:text-4xl mb-6 leading-tight font-semibold">{project.title}</h2>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-8 text-base">
                  {project.description}
                </p>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xs tracking-widest mb-4 text-gray-500 uppercase">Project Details</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {project.details}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 mt-auto">
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-black hover:bg-gray-800 text-white py-6"
                  onClick={() => window.open('#', '_blank')}
                >
                  View Live Project
                </Button>
                <Button 
                  variant="outline"
                  className="w-full py-6"
                  onClick={() => window.open('#', '_blank')}
                >
                  Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

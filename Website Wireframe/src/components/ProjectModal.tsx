import { Dialog, DialogContent } from './ui/dialog';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';
import type { Project } from './WorksSection';

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 gap-0 bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Image Carousel */}
          <div className="lg:col-span-3 relative bg-black h-[60vh] lg:h-full">
            <img
              src={project.images[currentImageIndex]}
              alt={`${project.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Carousel Controls */}
            {project.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col h-[40vh] lg:h-full overflow-y-auto">
            <div className="flex-1">
              <div className="mb-8">
                <div className="mb-6">
                  <p className="text-xs tracking-widest text-gray-500 mb-3">
                    {project.category} • {project.year}
                  </p>
                  <h2 className="text-3xl lg:text-4xl mb-6 leading-tight">{project.title}</h2>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-8 text-base">
                  {project.description}
                </p>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xs tracking-widest mb-4 text-gray-500">PROJECT DETAILS</h3>
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

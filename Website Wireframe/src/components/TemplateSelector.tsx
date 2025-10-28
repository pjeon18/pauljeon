import { Button } from './ui/button';
import { Card } from './ui/card';
import type { WireframeComponent } from '../App';

type TemplateSelectorProps = {
  onLoadTemplate: (template: WireframeComponent[]) => void;
};

export function TemplateSelector({ onLoadTemplate }: TemplateSelectorProps) {
  const templates = [
    {
      name: 'Landing Page',
      description: 'Hero section with features and CTA',
      components: [
        { id: 'header-1', type: 'header' as const },
        { id: 'hero-1', type: 'hero' as const },
        { id: 'content-1', type: 'content' as const },
        { id: 'card-grid-1', type: 'card-grid' as const },
        { id: 'footer-1', type: 'footer' as const },
      ],
    },
    {
      name: 'Blog Layout',
      description: 'Content-focused with sidebar',
      components: [
        { id: 'header-2', type: 'header' as const },
        { id: 'content-2', type: 'content' as const },
        { id: 'sidebar-1', type: 'sidebar' as const },
        { id: 'card-grid-2', type: 'card-grid' as const },
        { id: 'footer-2', type: 'footer' as const },
      ],
    },
    {
      name: 'Portfolio',
      description: 'Image gallery and projects',
      components: [
        { id: 'header-3', type: 'header' as const },
        { id: 'hero-2', type: 'hero' as const },
        { id: 'card-grid-3', type: 'card-grid' as const },
        { id: 'card-grid-4', type: 'card-grid' as const },
        { id: 'footer-3', type: 'footer' as const },
      ],
    },
    {
      name: 'Contact Page',
      description: 'Form with information',
      components: [
        { id: 'header-4', type: 'header' as const },
        { id: 'content-3', type: 'content' as const },
        { id: 'form-1', type: 'form' as const },
        { id: 'footer-4', type: 'footer' as const },
      ],
    },
    {
      name: 'Dashboard',
      description: 'Navigation with content grid',
      components: [
        { id: 'header-5', type: 'header' as const },
        { id: 'navigation-1', type: 'navigation' as const },
        { id: 'card-grid-5', type: 'card-grid' as const },
        { id: 'content-4', type: 'content' as const },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-gray-900 mb-2">Start with Template</h3>
        <p className="text-sm text-gray-600">Choose a pre-made layout</p>
      </div>
      {templates.map((template) => (
        <Card key={template.name} className="p-4 hover:border-gray-400 transition-colors">
          <h4 className="text-gray-900 mb-1">{template.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onLoadTemplate(template.components)}
          >
            Load Template
          </Button>
        </Card>
      ))}
    </div>
  );
}

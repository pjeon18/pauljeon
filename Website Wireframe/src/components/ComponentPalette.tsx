import { Button } from './ui/Button';
import { Card } from './ui/card';
import { 
  Layout, 
  Navigation, 
  Image, 
  Type, 
  Square, 
  Grid3x3, 
  FileText, 
  Menu,
  MousePointer
} from 'lucide-react';
import type { WireframeComponent } from '../App';

type ComponentPaletteProps = {
  onAddComponent: (type: WireframeComponent['type']) => void;
};

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const components = [
    { type: 'header' as const, label: 'Header', icon: Layout },
    { type: 'navigation' as const, label: 'Navigation', icon: Menu },
    { type: 'hero' as const, label: 'Hero Section', icon: Square },
    { type: 'content' as const, label: 'Content Block', icon: FileText },
    { type: 'card-grid' as const, label: 'Card Grid', icon: Grid3x3 },
    { type: 'sidebar' as const, label: 'Sidebar', icon: Navigation },
    { type: 'image' as const, label: 'Image Block', icon: Image },
    { type: 'text' as const, label: 'Text Block', icon: Type },
    { type: 'form' as const, label: 'Form', icon: FileText },
    { type: 'button-group' as const, label: 'Button Group', icon: MousePointer },
    { type: 'footer' as const, label: 'Footer', icon: Layout },
  ];

  return (
    <div className="space-y-3">
      <div className="mb-4">
        <h3 className="text-gray-900 mb-2">Add Components</h3>
        <p className="text-sm text-gray-600">Click to add to canvas</p>
      </div>
      {components.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          className="w-full justify-start"
          onClick={() => onAddComponent(type)}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
}

import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import type { WireframeComponent } from '../App';
import { WireframeBlock } from './WireframeBlock';

type WireframeCanvasProps = {
  components: WireframeComponent[];
  onRemoveComponent: (id: string) => void;
  onMoveComponent: (id: string, direction: 'up' | 'down') => void;
  viewMode: 'edit' | 'preview';
};

export function WireframeCanvas({ 
  components, 
  onRemoveComponent, 
  onMoveComponent,
  viewMode 
}: WireframeCanvasProps) {
  if (components.length === 0) {
    return (
      <Card className="p-12 text-center bg-white">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-dashed rounded" />
          </div>
          <h3 className="text-gray-900 mb-2">Your canvas is empty</h3>
          <p className="text-gray-600">
            Start building your wireframe by adding components from the sidebar or choosing a template
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {components.map((component, index) => (
        <div key={component.id} className="relative group">
          <WireframeBlock component={component} viewMode={viewMode} />
          
          {viewMode === 'edit' && (
            <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onMoveComponent(component.id, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onMoveComponent(component.id, 'down')}
                disabled={index === components.length - 1}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveComponent(component.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

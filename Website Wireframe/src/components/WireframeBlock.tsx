import { Card } from './ui/card';
import type { WireframeComponent } from '../App';

type WireframeBlockProps = {
  component: WireframeComponent;
  viewMode: 'edit' | 'preview';
};

export function WireframeBlock({ component, viewMode }: WireframeBlockProps) {
  const isEditMode = viewMode === 'edit';
  
  switch (component.type) {
    case 'header':
      return (
        <Card className={`p-6 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="w-32 h-8 bg-gray-300 rounded" />
            <div className="flex gap-4">
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-16 h-6 bg-gray-200 rounded" />
              <div className="w-20 h-6 bg-gray-400 rounded" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-2">Header Component</div>
          )}
        </Card>
      );

    case 'navigation':
      return (
        <Card className={`p-4 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-20 h-8 bg-gray-200 rounded" />
            ))}
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-2">Navigation Component</div>
          )}
        </Card>
      );

    case 'hero':
      return (
        <Card className={`p-12 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="h-12 bg-gray-300 rounded mb-4" />
            <div className="h-6 bg-gray-200 rounded mb-6 max-w-2xl mx-auto" />
            <div className="h-6 bg-gray-200 rounded mb-8 max-w-xl mx-auto" />
            <div className="flex gap-4 justify-center">
              <div className="w-32 h-10 bg-gray-400 rounded" />
              <div className="w-32 h-10 bg-gray-300 rounded" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4 text-center">Hero Section</div>
          )}
        </Card>
      );

    case 'content':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-gray-300 rounded mb-4 w-2/3" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-4/5" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Content Block</div>
          )}
        </Card>
      );

    case 'card-grid':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="h-8 bg-gray-300 rounded mb-6 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-2 border-gray-200 rounded-lg p-6">
                <div className="w-full h-32 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-4/5" />
              </div>
            ))}
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Card Grid Component</div>
          )}
        </Card>
      );

    case 'sidebar':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1 space-y-4">
              <div className="h-6 bg-gray-300 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded" />
            </div>
            <div className="md:col-span-3 space-y-4">
              <div className="h-8 bg-gray-300 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Sidebar Layout</div>
          )}
        </Card>
      );

    case 'image':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 border-2 border-gray-300 rounded mx-auto mb-2" />
              <div className="text-sm">Image Placeholder</div>
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Image Block</div>
          )}
        </Card>
      );

    case 'text':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="max-w-2xl">
            <div className="h-6 bg-gray-300 rounded mb-4 w-1/2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Text Block</div>
          )}
        </Card>
      );

    case 'form':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="h-8 bg-gray-300 rounded mb-6 w-1/2" />
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                <div className="h-10 bg-gray-100 border-2 border-gray-300 rounded" />
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                <div className="h-10 bg-gray-100 border-2 border-gray-300 rounded" />
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
                <div className="h-24 bg-gray-100 border-2 border-gray-300 rounded" />
              </div>
              <div className="w-32 h-10 bg-gray-400 rounded" />
            </div>
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Form Component</div>
          )}
        </Card>
      );

    case 'button-group':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="flex gap-4 justify-center">
            <div className="w-32 h-10 bg-gray-400 rounded" />
            <div className="w-32 h-10 bg-gray-300 rounded" />
            <div className="w-32 h-10 bg-gray-200 rounded" />
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4 text-center">Button Group</div>
          )}
        </Card>
      );

    case 'footer':
      return (
        <Card className={`p-8 bg-white ${isEditMode ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-300 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
          </div>
          {isEditMode && (
            <div className="text-xs text-gray-500 mt-4">Footer Component</div>
          )}
        </Card>
      );

    default:
      return null;
  }
}

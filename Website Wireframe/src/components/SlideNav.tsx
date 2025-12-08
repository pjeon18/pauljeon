interface SlideNavProps {
  anchors: { label: string; pageId: string }[];
  active?: string;
  onChange: (pageId: string) => void;
  activeHref?: string;
}

export default function SlideNav({ 
  anchors, 
  active, 
  onChange,
  activeHref 
}: SlideNavProps) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {anchors.map((anchor) => {
          const isActive = anchor.pageId === active;
          return (
            <button
              key={anchor.pageId}
              onClick={() => onChange(anchor.pageId)}
              className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white border border-black'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-black hover:bg-gray-50'
              }`}
            >
              {anchor.label}
            </button>
          );
        })}
        {activeHref && (
          <a
            href={activeHref}
            target="_blank"
            rel="noreferrer"
            className="ml-auto px-3 py-1.5 text-xs text-gray-600 hover:text-black border border-gray-300 hover:border-black transition-colors"
          >
            ↗ open
          </a>
        )}
      </div>
    </div>
  );
}



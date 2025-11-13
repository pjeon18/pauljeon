function setQueryParam(url: string, key: string, val?: string): string {
  const urlObj = new URL(url);
  if (val) {
    urlObj.searchParams.set(key, val);
  } else {
    urlObj.searchParams.delete(key);
  }
  return urlObj.toString();
}

interface FigmaEmbedProps {
  embedSrc: string;
  title?: string;
  ratio?: number;
  pageId?: string;
}

export default function FigmaEmbed({ 
  embedSrc, 
  title, 
  ratio = 16/9, 
  pageId 
}: FigmaEmbedProps) {
  const effectiveSrc = pageId 
    ? setQueryParam(embedSrc, "page-id", pageId) 
    : embedSrc;

  return (
    <div className="w-full">
      <div 
        style={{ aspectRatio: String(ratio) }} 
        className="w-full rounded-xl overflow-hidden shadow-lg"
      >
        <iframe 
          src={effectiveSrc} 
          title={title ?? "Figma slideshow"} 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allow="fullscreen" 
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">
        If the embed doesn't load,{' '}
        <a 
          href={effectiveSrc} 
          target="_blank" 
          rel="noreferrer" 
          className="underline hover:text-black transition-colors"
        >
          open in Figma
        </a>.
      </p>
    </div>
  );
}

export { setQueryParam };


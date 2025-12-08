type Props = {
  src: string;
  title?: string;
  ratio?: number; // default 16/9
};

export function PdfEmbed({ src, title, ratio }: Props) {
  const aspect = String(ratio ?? 16 / 9);
  const resolvedSrc = src.startsWith('http')
    ? src
    : `${import.meta.env.BASE_URL}${src}`;

  return (
    <div style={{ aspectRatio: aspect }} className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        src={resolvedSrc}
        title={title ?? 'Document'}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}


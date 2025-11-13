import React from "react";

type Props = {
  embedSrc: string;          // Google Slides /embed URL
  title?: string;
  ratio?: number;            // default 16/9
};

export default function SlidesEmbed({ embedSrc, title, ratio }: Props) {
  const aspect = String(ratio ?? (16 / 9));
  return (
    <div style={{ aspectRatio: aspect }} className="w-full rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={embedSrc}
        title={title ?? "Slides"}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allow="fullscreen"
        loading="lazy"
        className="w-full h-full"
      />
    </div>
  );
}


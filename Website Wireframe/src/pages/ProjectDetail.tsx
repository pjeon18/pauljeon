import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { projects, type Project } from '../content/projects';
import FigmaEmbed, { setQueryParam } from '../components/FigmaEmbed';
import SlideNav from '../components/SlideNav';
import SlidesEmbed from '../components/SlidesEmbed';
import { PdfEmbed } from '../components/PdfEmbed';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p: Project) => p.slug === slug);
  const [pageId, setPageId] = useState<string | undefined>(
    project?.slideAnchors?.[0]?.pageId
  );

  // Update pageId when project changes
  useEffect(() => {
    if (project?.slideAnchors?.[0]?.pageId) {
      setPageId(project.slideAnchors[0].pageId);
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      // Update meta tags
      document.title = `${project.title} | Paul Jeon`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', project.summary);
      }

      // TODO: add /og.png later
      // const ogImage = document.querySelector('meta[property="og:image"]');
      // if (ogImage) {
      //   ogImage.setAttribute('content', `${import.meta.env.BASE_URL}og.png`);
      // }
    }
  }, [project]);

  if (!project) {
    return (
      <>
        <Header />
        <main>
          <section className="min-h-screen px-8 lg:px-16 py-32 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl mb-4">Project Not Found</h1>
              <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
              <Link to="/work" className="text-primary hover:underline">
                ← Back to Work
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <article className="min-h-screen px-8 lg:px-16 py-32">
          <div className="w-full max-w-5xl mx-auto">
            {/* Back Link */}
            <Link 
              to="/work" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-12 transition-colors"
            >
              <span>←</span>
              <span>Back to Work</span>
            </Link>

            {/* Header */}
            <header className="mb-12">
              <p className="text-xs tracking-widest text-gray-500 mb-4">{project.role}</p>
              <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">{project.title}</h1>
              {project.timeframe && (
                <p className="text-sm text-gray-500">{project.timeframe}</p>
              )}
            </header>

            {/* Metrics */}
            {project.metrics.length > 0 && (
              <div className="mb-12 pb-12 border-b border-gray-200">
                <h2 className="text-sm tracking-widest text-gray-500 mb-4 uppercase">Key Metrics</h2>
                <ul className="space-y-2">
                  {project.metrics.map((metric, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="mb-12 flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 text-sm bg-gray-100 border border-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Body Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {project.body}
              </p>
              {project.link && (
                <p className="mt-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-medium hover:text-black transition-colors"
                  >
                    {project.linkLabel ?? 'View project'} ↗
                  </a>
                </p>
              )}
            </div>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.map((item, idx) => {
                  const resolvedSrc = item.src.startsWith('http')
                    ? item.src
                    : `${import.meta.env.BASE_URL}${item.src}`;
                  return (
                    <div key={idx} className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <img
                        src={resolvedSrc}
                        alt={item.alt ?? project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Documents (PDF embeds) */}
            {project.documents && project.documents.length > 0 && (
              <div className="space-y-8 mb-12">
                {project.documents.map((doc, index) => (
                  <div key={index}>
                    <PdfEmbed src={doc.href} title={doc.label} ratio={4 / 3} />
                    <p className="mt-2 text-sm text-gray-600">
                      If the embed doesn't load,{' '}
                      <a
                        href={doc.href.startsWith('http') ? doc.href : `${import.meta.env.BASE_URL}${doc.href}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-black transition-colors"
                      >
                        open {doc.label} ↗
                      </a>.
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Google Slides Embed */}
            {project.slidesEmbedSrc && (
              <div className="my-12">
                <SlidesEmbed embedSrc={project.slidesEmbedSrc} title={project.title} />
                <p className="mt-2 text-sm text-gray-600">
                  If the embed doesn't load,{" "}
                  <a
                    href={project.slidesEmbedSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-black transition-colors"
                  >
                    open in Google Slides ↗
                  </a>.
                </p>
              </div>
            )}

            {/* Figma Embed */}
            {project.figmaEmbedSrc && (
              <div className="my-12">
                {project.slideAnchors && project.slideAnchors.length > 0 && (
                  <SlideNav
                    anchors={project.slideAnchors}
                    active={pageId}
                    onChange={setPageId}
                    activeHref={pageId ? setQueryParam(project.figmaEmbedSrc, "page-id", pageId) : project.figmaEmbedSrc}
                  />
                )}
                <FigmaEmbed 
                  embedSrc={project.figmaEmbedSrc} 
                  title={project.title} 
                  pageId={pageId}
                />
                {project.slideAnchors && project.slideAnchors.length > 0 && pageId && (
                  <div className="mt-2 text-sm">
                    <a 
                      href={setQueryParam(project.figmaEmbedSrc, "page-id", pageId)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="underline hover:text-black transition-colors"
                    >
                      Open active slide ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </article>
      </main>
    </>
  );
}


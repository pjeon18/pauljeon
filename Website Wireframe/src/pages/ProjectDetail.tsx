import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { projects, type Project } from '../content/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p: Project) => p.slug === slug);

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
          <div className="max-w-4xl mx-auto">
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
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                {project.body}
              </p>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}


import { Link } from 'react-router-dom';
import content from '../../lib/content';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';

export default function Work() {
  return (
    <main>
      <Section className="min-h-screen">
        <Container>
          <div className="space-y-16">
            <Reveal>
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <Heading size="4xl">{content.pages.work.title}</Heading>
                <Text variant="lead">
                  {content.pages.work.description}
                </Text>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.projects.map((project, index) => (
                <Reveal key={project.id} delay={index * 0.1}>
                  <article className="group space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                      <div className="w-full h-full transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Text variant="caption" className="text-gray-500">
                          {project.category}
                        </Text>
                        <Text variant="caption" className="text-gray-500">
                          {project.year}
                        </Text>
                      </div>
                      <Heading size="xl">{project.title}</Heading>
                      <Text>{project.description}</Text>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs bg-gray-100 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm">
                        View Project →
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}


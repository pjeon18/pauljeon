import content from '../lib/content';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Reveal } from '../components/ui/Reveal';

export default function About() {
  return (
    <main>
      <Section className="min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            <Reveal>
              <div className="text-center space-y-4">
                <Heading size="4xl">{content.pages.about.title}</Heading>
              </div>
            </Reveal>

            <div className="space-y-12">
              {content.pages.about.sections.map((section, index) => (
                <Reveal key={index} delay={index * 0.2}>
                  <div className="space-y-4">
                    <Heading size="2xl">{section.title}</Heading>
                    <Text variant="lead">{section.content}</Text>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <div className="space-y-8">
                <Heading size="2xl">Skills</Heading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {content.pages.about.skills.map((skillGroup) => (
                    <div key={skillGroup.category} className="space-y-4">
                      <Heading size="lg">{skillGroup.category}</Heading>
                      <ul className="space-y-2">
                        {skillGroup.items.map((item) => (
                          <li key={item}>
                            <Text variant="body">{item}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </main>
  );
}


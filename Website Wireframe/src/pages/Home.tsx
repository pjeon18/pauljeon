import { Link } from 'react-router-dom';
import content from '../../lib/content';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <main>
      <Section className="min-h-screen flex items-center">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-sm tracking-widest text-gray-500 uppercase">
                {content.pages.home.hero.eyebrow}
              </p>
              <Heading as="h1" size="6xl">
                {content.pages.home.hero.title}
              </Heading>
              <p className="text-xl text-gray-600">
                {content.pages.home.hero.subtitle}
              </p>
              <Text>
                {content.pages.home.hero.description}
              </Text>
              <div className="flex gap-4">
                <Button as={Link} to="/work" size="lg">
                  View Work
                </Button>
                <Button as={Link} to="/contact" variant="outline" size="lg">
                  Get In Touch
                </Button>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg" />
          </div>
        </Container>
      </Section>

      <Section id="about" className="bg-gray-50">
        <Container size="md">
          <div className="text-center space-y-8">
            <Heading size="3xl">{content.pages.home.about.title}</Heading>
            <Text className="text-lg max-w-2xl mx-auto">
              {content.pages.home.about.description}
            </Text>
            <Text variant="lead" className="max-w-2xl mx-auto italic">
              {content.pages.home.about.highlight}
            </Text>
            <Button as={Link} to="/about" variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}


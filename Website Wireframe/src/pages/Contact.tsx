import { useState } from 'react';
import content from '../lib/content';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted', formData);
  };

  return (
    <main>
      <Section className="min-h-screen">
        <Container>
          <div className="max-w-3xl mx-auto space-y-16">
            <Reveal>
              <div className="text-center space-y-4">
                <Heading size="4xl">{content.pages.contact.title}</Heading>
                <Text variant="lead">{content.pages.contact.subtitle}</Text>
                <Text>{content.pages.contact.description}</Text>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Reveal delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <Text variant="caption" className="text-gray-500">
                      {content.pages.contact.email.label}
                    </Text>
                    <a
                      href={content.pages.contact.email.link}
                      className="block text-xl font-medium hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    >
                      {content.pages.contact.email.value}
                    </a>
                  </div>
                  <div className="flex gap-4">
                    {Object.entries(content.site.social).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {content.pages.contact.form.name.label}
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder={content.pages.contact.form.name.placeholder}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {content.pages.contact.form.email.label}
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder={content.pages.contact.form.email.placeholder}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {content.pages.contact.form.message.label}
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      placeholder={content.pages.contact.form.message.placeholder}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    {content.pages.contact.form.submit}
                  </Button>
                </form>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}


import { Header } from '../components/Header';
import { AboutSection } from '../components/AboutSection';
import { WorksSection } from '../components/WorksSection';
import { ContactSection } from '../components/ContactSection';

export default function Home() {
  return (
    <>
      <div id="top" className="h-0" />
      <Header />
      <main>
        <AboutSection />
        <WorksSection />
        <ContactSection />
      </main>
    </>
  );
}

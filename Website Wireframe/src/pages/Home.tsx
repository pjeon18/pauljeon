import { AboutSection } from '../components/AboutSection';
import { WorksSection } from '../components/WorksSection';
import { ResumeSection } from '../components/ResumeSection';
import { ContactSection } from '../components/ContactSection';

export default function Home() {
  return (
    <>
      <div id="top" className="h-0" />
      <main>
        <AboutSection />
        <WorksSection />
        <ResumeSection />
        <ContactSection />
      </main>
    </>
  );
}

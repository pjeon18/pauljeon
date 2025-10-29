import { Header } from '../components/Header';
import { AboutSection } from '../components/AboutSection';
import { Footer } from '../components/layout/Footer';

export default function About() {
  return (
    <>
      <Header />
      <main>
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}

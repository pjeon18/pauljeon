import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import GamesPage from './pages/Games';
import ImpostorGamePage from './pages/ImpostorGame';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/impostor" element={<ImpostorGamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

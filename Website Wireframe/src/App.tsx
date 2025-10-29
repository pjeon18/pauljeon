import { BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';

export default function App() {
  return (
    <BrowserRouter basename="/pauljeon">
      <div className="min-h-screen">
        <Home />
      </div>
    </BrowserRouter>
  );
}

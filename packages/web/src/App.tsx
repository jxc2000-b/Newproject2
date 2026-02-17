import { Routes, Route, Link, useLocation } from 'react-router-dom';
import FeedView from './pages/FeedView';
import AlgorithmEditor from './pages/AlgorithmEditor';
import SourceManager from './pages/SourceManager';
import Marketplace from './pages/Marketplace';
import Notifications from './pages/Notifications';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <h1>Feed Aggregation Platform</h1>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Feed
          </Link>
          <Link to="/algorithms" className={location.pathname === '/algorithms' ? 'active' : ''}>
            Algorithms
          </Link>
          <Link to="/sources" className={location.pathname === '/sources' ? 'active' : ''}>
            Sources
          </Link>
          <Link to="/marketplace" className={location.pathname === '/marketplace' ? 'active' : ''}>
            Marketplace
          </Link>
          <Link to="/notifications" className={location.pathname === '/notifications' ? 'active' : ''}>
            Notifications
          </Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<FeedView />} />
          <Route path="/algorithms" element={<AlgorithmEditor />} />
          <Route path="/sources" element={<SourceManager />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import the Sidebar Component
import Home from './pages/Home';
import Trending from './pages/Trending';
import Login from './pages/Login';
import Explore from './pages/Explore';
import Favourites from './pages/Favourites';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </Sidebar>
    </Router>
  );
}

export default App;
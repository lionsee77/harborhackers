import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import the Sidebar Component
import Home from './pages/Home';
import PortPal from './pages/PortPal';
import Login from './pages/Login';
import Compass from './pages/Compass';
import DockWorks from './pages/DockWorks';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
import User from './pages/User';
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Sidebar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/portpal" element={<PortPal />} />
            <Route path="/compass" element={<Compass />} />
            <Route path="/dockworks" element={<DockWorks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<User />} />
            <Route path="/tasks" element={<Tasks />} />

          </Routes>
        </Sidebar>
      </AuthProvider>
    </Router>
  );
}

export default App;
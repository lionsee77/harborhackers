import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Router>
      <Box>
        <Sidebar />
        <Routes>
          {/* Other components can go here */}
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
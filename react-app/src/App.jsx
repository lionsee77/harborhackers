import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import Page1 from './pages/Home';
import Page2 from './pages/Trending';
import Page3 from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Flex minH="100vh">
        {/* Sidebar Section */}
        <Box position="fixed" top="0" left="0" h="full" w="full">
          <Sidebar />
        </Box>

        {/* Main Content Area */}
        <Box
          ml="60" // Match Sidebar width
          mt="20" // Account for header height
          p="8"
          flex="1"
          bg="gray.50"
        >
          <Routes>
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
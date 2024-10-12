// src/pages/Page1.jsx
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import Features from '../components/Features';

function Home() {
    return (
        <Box p={8}>
            <Features />
        </Box>
    );
}

export default Home;
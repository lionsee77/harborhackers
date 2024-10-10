// src/pages/Page1.jsx
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

function Page1() {
    return (
        <Box p={8}>
            <Heading>Page 1</Heading>
            <Text mt={4}>This is the content for Page 1.</Text>
        </Box>
    );
}

export default Page1;
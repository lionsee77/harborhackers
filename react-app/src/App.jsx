import React from 'react';
import { Box, Button, Heading, Text, Stack, useColorMode, Grid, GridItem, Container, Center, Flex } from '@chakra-ui/react';

function App() {
  // Optional: Use this to toggle between light and dark mode for preview.
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
      minH={{ base: '100vh', md: '100vh' }}  // Responsive min-height for small and medium screens
      minW='100%'    // Responsive min-width; full width on s
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      {/* Center the content using a flex container */}
      <Container maxW="container.lg">
        <Stack spacing={8} align="center">
          {/* Header Section */}
          <Heading as="h1" size="2xl" color="brand.500" mb={4}>
            Welcome to PSA HR Platform
          </Heading>
          <Text fontSize="lg" color={colorMode === 'light' ? 'gray.700' : 'gray.300'}>
            A simple placeholder to demonstrate the custom Chakra UI theme.
          </Text>

          {/* Button Variants */}
          <Stack direction="row" spacing={4}>
            <Button colorScheme="brand" variant="solid">
              Solid Button
            </Button>
            <Button colorScheme="brand" variant="outline">
              Outline Button
            </Button>
            <Button colorScheme="brand" variant="ghost">
              Ghost Button
            </Button>
          </Stack>

          {/* Card-like Grid Example */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6} pt={8}>
            <GridItem w="100%" p={4} bg="white" shadow="md" borderRadius="md">
              <Heading size="md" mb={2} color="brand.500">
                Employee Management
              </Heading>
              <Text color="gray.600">Manage employee details, roles, and responsibilities.</Text>
            </GridItem>

            <GridItem w="100%" p={4} bg="white" shadow="md" borderRadius="md">
              <Heading size="md" mb={2} color="brand.500">
                Attendance Tracker
              </Heading>
              <Text color="gray.600">Track attendance and manage employee schedules.</Text>
            </GridItem>

            <GridItem w="100%" p={4} bg="white" shadow="md" borderRadius="md">
              <Heading size="md" mb={2} color="brand.500">
                Payroll System
              </Heading>
              <Text color="gray.600">Easily manage payrolls and compensation details.</Text>
            </GridItem>
          </Grid>

          {/* Toggle Button for Dark Mode Preview */}
          <Button onClick={toggleColorMode} colorScheme="brand" mt={8}>
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'} Mode
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
}

export default App;
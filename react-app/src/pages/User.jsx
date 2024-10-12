import React from 'react'
import { useAuth } from '../context/AuthContext' // Import the AuthContext
import { useNavigate } from 'react-router-dom'
import { Box, Button, Text, Flex, Heading } from '@chakra-ui/react'
import EmployeeForm from '../components/Form'

export default function User() {
    const { user, signOut, loading } = useAuth()
    const navigate = useNavigate()

    // Handle logout
    const handleLogout = async () => {
        await signOut()
        navigate('/login') // Redirect to login page after logging out
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        // If no user is logged in, redirect to login
        navigate('/login')
        return null
    }

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.50'}>
            
            <Box
                p={8}
                maxWidth="400px"
                w={'full'}
                bg="white"
                boxShadow="lg"
                rounded="lg"
                textAlign="center">
                <Heading fontSize="2xl" mb={4}>
                    Logged in as:
                </Heading>
                <Text fontSize="lg" mb={2}>
                    <strong>Email:</strong> {user.email}
                </Text>
                {/* Add more user information here if available from your database */}
                <EmployeeForm />

                <Button
                    bg="red"
                    mt={6}
                    onClick={handleLogout}
                    w={'full'}>
                    Logout
                </Button>
            </Box>
            
        </Flex>
        
    )
}
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import SidebarWithHeader from './Sidebar';

const Layout = ({ children }) => {
    return (
        <Flex>
            <SidebarWithHeader />
            <Box
                flex="1"
                ml={{ base: 0, md: 60 }}
                mt="20"
                p="8"
            >
                {children}
            </Box>
        </Flex>
    );
};

export default Layout;
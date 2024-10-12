import React from 'react';
import TaskList from '../components/TaskList'; // Make sure this path is correct
import { Box } from '@chakra-ui/react';

const Tasks = () => {
    return (
        <Box>
            <TaskList />
        </Box>
    );
};

export default Tasks;

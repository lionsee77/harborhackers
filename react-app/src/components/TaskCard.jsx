import React from 'react';
import { Box, Text, Checkbox, Badge, Stack, Tag, TagLabel } from '@chakra-ui/react';

// Helper function to determine badge color based on difficulty
const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case 'easy':
            return 'green';
        case 'medium':
            return 'yellow';
        case 'hard':
            return 'red';
        default:
            return 'gray';
    }
};

const getTagColor = (type) => {
    switch (type.trim().toLowerCase()) {
        case 'single':
            return 'yellow';
        case 'pair':
            return 'blue';
        case 'fun':
            return 'purple';
        case 'work':
            return 'orange'
        default:
            return 'gray';
    }
};

const TaskCard = ({ task, onToggle }) => {
    const taskTypes = task.task_type.split('_');
    const partnerName = task.partner_id || null;

    return (
        <Box p={4} borderWidth="1px" borderRadius="lg" mb={4} bg={task.completed ? 'gray.200' : 'white'}>
            <Stack spacing={3}>
                {/* Task description */}
                <Text fontSize="lg" fontWeight="bold">
                    {task.task_description}
                </Text>

                {/* Points */}
                <Text fontSize="md" color="gray.500">
                    Points: {task.points}
                </Text>

                {/* Difficulty */}
                <Text fontSize="md" color="gray.500">
                    Difficulty: <Badge colorScheme={getDifficultyColor(task.difficulty)}>{task.difficulty}</Badge>
                </Text>

                 {/* Tags display */}
                 <Text fontSize="md" color="gray.500">
                    Tags: {taskTypes.map((type, index) => (
                        <Badge key={index} colorScheme={getTagColor(type)} mr={2}>
                            {type.trim()}
                        </Badge>
                    ))}
                </Text>

                {/* Partner display if applicable */}
                {partnerName && (
                    <Text fontSize="md" color="gray.500">
                        Partner: {partnerName}
                    </Text>
                )}

                {/* Completion checkbox */}
                <Checkbox
                    isChecked={task.completed}
                    onChange={() => onToggle(task.task_id)}
                >
                    {task.completed ? 'Completed' : 'Mark as Completed'}
                </Checkbox>
            </Stack>
        </Box>
    );
};

export default TaskCard;

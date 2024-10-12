import React, { useState, useEffect } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import TaskCard from './TaskCard';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);

    // Placeholder function to simulate data fetch
    const fetchTasks = async () => {
        return [
            {
                task_id: '1',
                user_id: "101",
                partner_id: null,
                task_description: "Host a virtual coffee break",
                task_type: "single_fun",
                difficulty: "easy",
                points: 10,
                suggested_courses: [],
                completed: false,
                created_at: null
            },
            {
                task_id: '2',
                user_id: "101",
                partner_id: "102",
                task_description: "Host a game session",
                task_type: "pair_fun",
                difficulty: "medium",
                points: 20,
                suggested_courses: [],
                completed: true,
                created_at: null
            },
            // Add more tasks here...
        ];
    };

    // Fetch tasks when the component mounts
    useEffect(() => {
        const getTasks = async () => {
            const fetchedTasks = await fetchTasks();
            setTasks(fetchedTasks);
            calculateTotalPoints(fetchedTasks);
        };

        getTasks();
    }, []);

    const calculateTotalPoints = (taskList) => {
        const total = taskList.reduce((acc, task) => {
            return task.completed ? acc + task.points : acc;
        }, 0);
        setTotalPoints(total);
    };

    const handleToggle = (taskId) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) => {
                if (task.task_id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });

            // Update total points
            calculateTotalPoints(updatedTasks);

            return updatedTasks;
        });
    };

    // Split tasks into completed and uncompleted
    const completedTasks = tasks.filter(task => task.completed);
    const uncompletedTasks = tasks.filter(task => !task.completed);

    return (
        <Box p={8}>
            <Heading mb={4}>Tasks</Heading>
            <Text mb={4}>Total Points: {totalPoints}</Text>
            <Heading size="md" mb={2}>Uncompleted Tasks</Heading>
            {uncompletedTasks.map((task) => (
                <TaskCard key={task.task_id} task={task} onToggle={handleToggle} />
            ))}
            <Heading size="md" mb={2} mt={6}>Completed Tasks</Heading>
            {completedTasks.map((task) => (
                <TaskCard key={task.task_id} task={task} onToggle={handleToggle} />
            ))}
        </Box>
    );
};

export default TaskList;
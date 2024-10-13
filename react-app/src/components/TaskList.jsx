import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, useColorModeValue, ScaleFade, Spinner, Alert, AlertIcon, AlertTitle, AlertDescription} from '@chakra-ui/react';
import TaskCard from './TaskCard';
import { supabase } from '../supabaseClient';
import { useSpring, animated } from '@react-spring/web'; // Import for animations
import { useAuth } from '../context/AuthContext'; // Import the AuthContext to get the logged-in user


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const { user,loading } = useAuth(); // Get the logged-in user from the AuthContext

    // Animation state for total points
    const props = useSpring({ number: totalPoints, from: { number: 0 } });

    // Fetch tasks for the logged-in user from Supabase
    const fetchTasks = async () => {
        if (!user) {
            console.error('No user is logged in.');
            return [];
        }

        // Fetch tasks for the logged-in user
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id); // Filter tasks by the user's id

        if (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }

        return data;
    };


    // Fetch tasks when the component mounts
    useEffect(() => {
        const getTasks = async () => {
            if (loading) return; // Wait for loading to finish before fetching tasks

            if (!user) {
                console.error('No user is logged in.');
                return;
            }

            const fetchedTasks = await fetchTasks();
            setTasks(fetchedTasks);
            calculateTotalPoints(fetchedTasks);
        };

        getTasks();
    }, [user, loading]);

    const calculateTotalPoints = (taskList) => {
        const total = taskList.reduce((acc, task) => {
            return task.completed ? acc + task.points : acc;
        }, 0);
        setTotalPoints(total);
    };

    const handleToggle = async (taskId) => {
        let updatedTask;
        // Toggle completion and update the completed_at field
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) => {
                if (task.task_id === taskId) {
                    const newTask = { ...task, completed: !task.completed };
                    if (newTask.completed) {
                        newTask.completed_at = new Date().toISOString();
                    } else {
                        newTask.completed_at = null;
                    }
                    updatedTask = newTask;
                    return newTask;
                }
                return task;
            });

            // Ensure updatedTask is defined and properly toggled
            if (!updatedTask) {
                console.error("Task not found or not updated.");
                return;
            }
            // Log for debugging purposes
            console.log("Task after toggle:", updatedTask);

            // Update total points
            calculateTotalPoints(updatedTasks);

            return updatedTasks;
        });
        // Update task in Supabase
        const taskToUpdate = tasks.find(t => t.task_id === taskId);

        // Ensure task exists
        if (!taskToUpdate) {
            console.error("Task not found.");
            return;
        }
        const { error } = await supabase
            .from('tasks')
            .update({
                completed: updatedTask.completed,
                completed_at: updatedTask.completed ? new Date().toISOString() : null
            })
            .eq('task_id', taskId);
        if (error) {
            console.error('Error updating task:', error);
        }
    };

    // Split tasks into completed and uncompleted
    const completedTasks = tasks.filter(task => task.completed);
    const uncompletedTasks = tasks.filter(task => !task.completed);

    // Chakra UI dynamic color based on theme mode
    const pointsColor = useColorModeValue('blue.500', 'yellow.300'); // Use dynamic color for total points

    if (loading) {
        // Show a spinner while waiting for the auth state to resolve
        return (
            <Box p={8}>
                <Spinner size="xl" />
                <Text>Loading tasks...</Text>
            </Box>
        );
    }
    if (!user) {
        // Display a warning alert if the user is not logged in
        return (
            <Box p={8}>
                <Alert status="warning">
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            You need to log in to view your tasks.
                        </AlertDescription>
                    </Box>
                </Alert>
            </Box>
        );
    }
    return (
        <Box p={8}>

            {/* Animated Total Points */}
            <ScaleFade initialScale={0.9} in={true}>
                <Text fontSize="2xl" fontWeight="bold" color={pointsColor} mb={4}>
                    Total PortPoints:{' '}
                    <animated.span>
                        {props.number.to((n) => Math.floor(n))}
                    </animated.span>
                </Text>
            </ScaleFade>

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
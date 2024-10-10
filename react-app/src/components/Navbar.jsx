// src/components/Navbar.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Flex,
    Text,
    Icon,
    IconButton,
    Button,
    Stack,
    Collapse,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();

    // Use custom brand colors defined in theme.js
    const bg = useColorModeValue('brand.500', 'brand.900'); // Light mode and dark mode colors
    const textColor = useColorModeValue('white', 'white');
    const buttonBg = useColorModeValue('brand.400', 'brand.600');
    const buttonHover = useColorModeValue('brand.300', 'brand.700');

    return (
        <Box>
            {/* Main Navbar */}
            <Flex
                bg={bg}
                color={textColor}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}
            >
                {/* Mobile Menu Toggle Button */}
                <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>

                {/* Logo / Brand Name */}
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        fontWeight={'bold'}
                        color={textColor}
                        fontSize="lg"
                        as={RouterLink}
                        to="/" // Link the logo back to the homepage
                    >
                        HarborHackers
                    </Text>

                    {/* Render DesktopNav here for larger screens */}
                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav /> {/* Integrate the DesktopNav component here */}
                    </Flex>
                </Flex>

                {/* Right-side Buttons (Sign In and Sign Up) */}
                <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
                    <Button as={RouterLink} to="/signin" fontSize={'sm'} fontWeight={400} variant={'link'} color={textColor}>
                        Sign In
                    </Button>
                    <Button
                        as={RouterLink}
                        to="/signup"
                        display={{ base: 'none', md: 'inline-flex' }}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={buttonBg}
                        _hover={{ bg: buttonHover }}
                    >
                        Sign Up
                    </Button>
                </Stack>
            </Flex>

            {/* Mobile Menu Collapse */}
            <Collapse in={isOpen} animateOpacity>
                <MobileNav items={NAV_ITEMS} /> {/* MobileNav component for small screens */}
            </Collapse>
        </Box>
    );
}
const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            {/* Use RouterLink for internal navigation */}
                            <Box
                                as={RouterLink}
                                to={navItem.href ?? '#'}
                                p={2}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Box>
                        </PopoverTrigger>

                        {/* Display children (sub-items) for dropdowns */}
                        {navItem.children && (
                            <PopoverContent border={0} boxShadow={'xl'} bg={popoverContentBgColor} p={4} rounded={'xl'} minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
    return (
        <Box
            as={RouterLink}
            to={href} // Use 'to' instead of 'href' for React Router
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Box>
    );
};

const MobileNav = ({ items }) => {
    // Debugging: Check if `items` is received correctly
    console.log("MobileNav component rendered. Received items:", items);

    return (
        <Stack bg={useColorModeValue('brand.500', 'gray.800')} p={4} display={{ md: 'none' }}>
            {items.map((navItem, index) => (
                <MobileNavItem key={index} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }) => {
    const { isOpen, onToggle } = useDisclosure();

    // Debugging: Log when each MobileNavItem is rendered
    console.log("Rendering MobileNavItem:", label, href, "Has children?", !!children);

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Box
                py={2}
                as={RouterLink}
                to={href ?? '#'}
                justifyContent="space-between"
                alignItems="center"
                _hover={{ textDecoration: 'none' }}>
                <Text fontWeight={600} color={useColorModeValue('white', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Box>

            <Collapse in={isOpen} animateOpacity>
                <Stack mt={2} pl={4} borderLeft={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.700')} align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Box as={RouterLink} key={child.label} py={2} to={child.href}>
                                {child.label}
                            </Box>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

const NAV_ITEMS = [
    {
        label: 'Page 1',
        href: '/page1',
    },
    {
        label: 'Page 2',
        href: '/page2',
    },
    {
        label: 'Page 3',
        href: '/page3',
    },
];
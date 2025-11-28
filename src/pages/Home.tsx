import { Box, Flex, Heading, Text, Button, VStack, Container, Image, Grid } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiLogIn, FiUserPlus, FiDatabase, FiMail, FiBarChart, FiZap, FiShield, FiClock } from 'react-icons/fi'
import homeImage from '../assets/home image.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex
        as="header"
        justify="space-between"
        align="center"
        px={8}
        py={4}
        bg="white"
        borderBottomWidth={1}
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
        boxShadow="sm"
      >
        <Heading size="lg" color="gray.900">
          <Text as="span" fontWeight="bold">Nexus</Text>
          {' '}
          <Text as="span" fontWeight="normal" color="gray.600">for Tableau</Text>
        </Heading>
        <Flex gap={3}>
          <Button
            variant="ghost"
            color="gray.700"
            onClick={() => navigate('/login')}
            _hover={{ bg: 'gray.100' }}
          >
            Login
          </Button>
          <Button
            bg="black"
            color="white"
            onClick={() => navigate('/signup')}
            _hover={{ bg: 'gray.800', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
            boxShadow="sm"
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>

      {/* Hero Section with Image */}
      <Container maxW="7xl" py={16}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
          gap={12}
          alignItems="center"
        >
          {/* Left Side - Text Content */}
          <VStack align="start" gap={6}>
            <Box>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="purple.600"
                textTransform="uppercase"
                letterSpacing="wide"
                mb={3}
              >
                Automate Your Workflow
              </Text>
              <Heading
                size="3xl"
                color="gray.900"
                mb={4}
                lineHeight="1.1"
              >
                Simplify Tableau Report Distribution
              </Heading>
              <Text
                fontSize="xl"
                color="gray.600"
                lineHeight="1.7"
              >
                Nexus for Tableau streamlines your reporting workflow. Connect your Tableau server,
                configure reports once, and deliver them automatically via API. Save hours every week.
              </Text>
            </Box>

            {/* CTA Buttons */}
            <Flex gap={4} mt={4}>
              <Button
                size="lg"
                bg="black"
                color="white"
                px={8}
                h={14}
                fontSize="lg"
                onClick={() => navigate('/signup')}
                _hover={{ bg: 'gray.800', transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
                boxShadow="md"
              >
                <FiUserPlus style={{ marginRight: '8px' }} />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="gray.900"
                borderColor="gray.300"
                px={8}
                h={14}
                fontSize="lg"
                onClick={() => navigate('/login')}
                _hover={{ bg: 'gray.100' }}
                transition="all 0.2s"
              >
                <FiLogIn style={{ marginRight: '8px' }} />
                Sign In
              </Button>
            </Flex>

            {/* Stats */}
            <Flex gap={8} mt={6} pt={6} borderTopWidth={1} borderColor="gray.200" w="full">
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">10x</Text>
                <Text fontSize="sm" color="gray.600">Faster Setup</Text>
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">100%</Text>
                <Text fontSize="sm" color="gray.600">Automated</Text>
              </Box>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900">24/7</Text>
                <Text fontSize="sm" color="gray.600">Availability</Text>
              </Box>
            </Flex>
          </VStack>

          {/* Right Side - Image */}
          <Box
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            bg="white"
            p={2}
          >
            <Image
              src={homeImage}
              alt="Nexus for Tableau Dashboard"
              borderRadius="xl"
              w="full"
              h="auto"
              objectFit="cover"
            />
          </Box>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box bg="white" py={20} borderTopWidth={1} borderColor="gray.200">
        <Container maxW="7xl">
          <VStack gap={4} textAlign="center" mb={12}>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="purple.600"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Features
            </Text>
            <Heading size="2xl" color="gray.900">
              Everything You Need to Succeed
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Powerful features designed to make Tableau report management effortless
            </Text>
          </VStack>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={8}
          >
            {/* Feature 1 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiDatabase size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                Easy Integration
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                Connect to your Tableau Server with simple credentials. Start managing reports in minutes, not hours.
              </Text>
            </Box>

            {/* Feature 2 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiZap size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                API-First Design
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                RESTful API for seamless integration with your existing systems and workflows.
              </Text>
            </Box>

            {/* Feature 3 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiBarChart size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                Multi-format Support
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                Export reports in PDF, PNG, or other formats with custom parameters and filters.
              </Text>
            </Box>

            {/* Feature 4 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiClock size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                Schedule & Automate
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                Set it and forget it. Automate report delivery on your schedule with zero manual effort.
              </Text>
            </Box>

            {/* Feature 5 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiShield size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                Secure by Default
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                Enterprise-grade security with encrypted credentials and role-based access control.
              </Text>
            </Box>

            {/* Feature 6 */}
            <Box
              bg="gray.50"
              borderRadius="xl"
              p={8}
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ borderColor: 'purple.300', transform: 'translateY(-4px)', boxShadow: 'lg' }}
              transition="all 0.3s"
            >
              <Flex
                bg="black"
                w={14}
                h={14}
                borderRadius="xl"
                align="center"
                justify="center"
                mb={4}
              >
                <FiMail size={28} color="white" />
              </Flex>
              <Heading size="md" color="gray.900" mb={3}>
                Smart Delivery
              </Heading>
              <Text color="gray.600" lineHeight="1.7">
                Intelligent report distribution to the right people at the right time, every time.
              </Text>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="gray.900" py={20}>
        <Container maxW="5xl">
          <VStack gap={6} textAlign="center">
            <Heading size="2xl" color="white" lineHeight="1.2">
              Ready to Transform Your Reporting Workflow?
            </Heading>
            <Text fontSize="xl" color="gray.300" maxW="2xl">
              Join teams already using Nexus to save hours every week on report distribution
            </Text>
            <Flex gap={4} mt={4}>
              <Button
                size="lg"
                bg="white"
                color="gray.900"
                px={8}
                h={14}
                fontSize="lg"
                onClick={() => navigate('/signup')}
                _hover={{ bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: 'xl' }}
                transition="all 0.2s"
                boxShadow="lg"
              >
                <FiUserPlus style={{ marginRight: '8px' }} />
                Start Free Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                px={8}
                h={14}
                fontSize="lg"
                onClick={() => navigate('/login')}
                _hover={{ bg: 'whiteAlpha.200' }}
                transition="all 0.2s"
              >
                <FiLogIn style={{ marginRight: '8px' }} />
                Sign In
              </Button>
            </Flex>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        py={8}
        px={8}
        bg="white"
        borderTopWidth={1}
        borderColor="gray.200"
      >
        <Container maxW="7xl">
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Text color="gray.600" fontSize="sm">
              © 2025 Nexus for Tableau. All rights reserved.
            </Text>
            <Flex gap={6}>
              <Text
                color="gray.600"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'gray.900' }}
              >
                Privacy Policy
              </Text>
              <Text
                color="gray.600"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'gray.900' }}
              >
                Terms of Service
              </Text>
              <Text
                color="gray.600"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'gray.900' }}
              >
                Contact
              </Text>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

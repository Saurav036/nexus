import { Box, Flex, Heading, Text, Button, VStack, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiLogIn, FiUserPlus, FiDatabase, FiMail, FiBarChart } from 'react-icons/fi'

export default function Home() {
  const navigate = useNavigate()

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
      {/* Header */}
      <Flex
        as="header"
        justify="space-between"
        align="center"
        px={8}
        py={4}
        borderBottomWidth={1}
        borderColor="whiteAlpha.300"
        bg="whiteAlpha.200"
      >
        <Heading size="lg" color="white">
          <Text as="span" fontWeight="bold">Nexus</Text>
          {' '}
          <Text as="span" fontWeight="normal" opacity={0.9}>for Tableau</Text>
        </Heading>
        <Flex gap={3}>
          <Button
            variant="ghost"
            color="white"
            onClick={() => navigate('/login')}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            Login
          </Button>
          <Button
            bg="white"
            color="purple.600"
            onClick={() => navigate('/signup')}
            _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>

      {/* Hero Section */}
      <Container maxW="6xl" py={20}>
        <VStack gap={8} textAlign="center">
          {/* Main Heading */}
          <Box>
            <Heading
              size="2xl"
              color="white"
              mb={4}
              lineHeight="1.2"
            >
              Automate Your Tableau Reports
            </Heading>
            <Text
              fontSize="xl"
              color="whiteAlpha.900"
              maxW="2xl"
              mx="auto"
            >
              Nexus for Tableau helps you schedule, deliver, and manage your Tableau reports with ease.
              Connect your Tableau server and start automating report distribution today.
            </Text>
          </Box>

          {/* CTA Buttons */}
          <Flex gap={4} mt={4}>
            <Button
              size="lg"
              bg="white"
              color="purple.600"
              px={8}
              h={14}
              fontSize="lg"
              onClick={() => navigate('/signup')}
              _hover={{ bg: 'gray.100', transform: 'translateY(-2px)', boxShadow: 'xl' }}
              transition="all 0.2s"
              boxShadow="lg"
            >
              <FiUserPlus style={{ marginRight: '8px' }} />
              Get Started
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

          {/* Features Grid */}
          <Box mt={16} w="full">
            <Heading size="lg" color="white" mb={8}>
              Why Choose Nexus?
            </Heading>
            <Flex gap={6} wrap="wrap" justify="center">
              {/* Feature 1 */}
              <Box
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={6}
                flex="1"
                minW="250px"
                maxW="300px"
                borderWidth={1}
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
              >
                <Flex
                  bg="whiteAlpha.300"
                  w={12}
                  h={12}
                  borderRadius="lg"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <FiDatabase size={24} color="white" />
                </Flex>
                <Heading size="md" color="white" mb={2}>
                  Easy Integration
                </Heading>
                <Text color="whiteAlpha.900" fontSize="sm">
                  Connect to your Tableau Server with simple credentials and start managing reports instantly.
                </Text>
              </Box>

              {/* Feature 2 */}
              <Box
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={6}
                flex="1"
                minW="250px"
                maxW="300px"
                borderWidth={1}
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
              >
                <Flex
                  bg="whiteAlpha.300"
                  w={12}
                  h={12}
                  borderRadius="lg"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <FiMail size={24} color="white" />
                </Flex>
                <Heading size="md" color="white" mb={2}>
                  Automated Delivery
                </Heading>
                <Text color="whiteAlpha.900" fontSize="sm">
                  Schedule and automate report delivery via API. Configure once, deliver forever.
                </Text>
              </Box>

              {/* Feature 3 */}
              <Box
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={6}
                flex="1"
                minW="250px"
                maxW="300px"
                borderWidth={1}
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-4px)' }}
                transition="all 0.3s"
              >
                <Flex
                  bg="whiteAlpha.300"
                  w={12}
                  h={12}
                  borderRadius="lg"
                  align="center"
                  justify="center"
                  mb={4}
                >
                  <FiBarChart size={24} color="white" />
                </Flex>
                <Heading size="md" color="white" mb={2}>
                  Multi-format Support
                </Heading>
                <Text color="whiteAlpha.900" fontSize="sm">
                  Export reports in PDF, PNG, or other formats with custom parameters and filters.
                </Text>
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        py={8}
        px={8}
        borderTopWidth={1}
        borderColor="whiteAlpha.300"
        bg="whiteAlpha.100"
        mt={20}
      >
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Text color="whiteAlpha.900" fontSize="sm">
              © 2025 Nexus for Tableau. All rights reserved.
            </Text>
            <Flex gap={6}>
              <Text
                color="whiteAlpha.900"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'white' }}
              >
                Privacy Policy
              </Text>
              <Text
                color="whiteAlpha.900"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'white' }}
              >
                Terms of Service
              </Text>
              <Text
                color="whiteAlpha.900"
                fontSize="sm"
                cursor="pointer"
                _hover={{ color: 'white' }}
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

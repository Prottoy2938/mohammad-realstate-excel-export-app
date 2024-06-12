import { Box, Button, Center, Heading, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import { Search } from '../search/Search';
import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }

  const router = useRouter();
  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push('/');
    }
    if (user && !user.isActive) {
      router.push('/');
    }
  }, []);

  return (
    <>
      <Hero />
      <Heading margin="0 auto" mt={'10vh'} textAlign={'center'} display="table">
        Dashboard
      </Heading>
      <Search />
      <Center h="100vh">
        <Box
          p={20}
          py={'100px'}
          px={'100px'}
          borderWidth={1}
          borderRadius="lg"
          border={'1px dashed black'}
        >
          <VStack spacing={6}>
            <a href="/create-new-client">
              <Button size="lg" colorScheme="blue" px={20} variant="outline">
                Create New Client
              </Button>
            </a>
            <a href="/my-clients">
              <Button size="lg" colorScheme="blue" px={20} variant="outline">
                My Clients
              </Button>
            </a>
            <a href="/my-profile">
              <Button size="lg" colorScheme="blue" px={20} variant="outline">
                My Profile
              </Button>
            </a>
           
            {/* <a href="/files">
              <Button size="lg" colorScheme="blue" px={20} variant="outline">
                Files
              </Button>
            </a>
            <a href="/my-group">
              <Button size="lg" colorScheme="blue" px={20} variant="outline">
                My Group
              </Button>
            </a> */}

            {/* {user && user.userType && user.userType.includes('admin') && (
              <a href="/admin">
                <Button size="lg" colorScheme="red" px={20} variant="outline">
                  Admin
                </Button>
              </a>
            )} */}
          </VStack>
        </Box>
      </Center>
      <Footer />
    </>
  );
};

export default Index;

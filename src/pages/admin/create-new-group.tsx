import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import { Footer } from '../../templates/Footer';
import { Hero } from '../../templates/Hero';

const Index = () => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    if (user && !user.userType.includes('admin')) {
      router.push('/dashboard');
    }
  }, []);

  const handleInputChange = (event: any) => {
    setGroupName(event.target.value);
  };
  const toast = useToast();

  const handleCreateGroup = async () => {
    setLoading(true);
    const auth = getAuth();

    // Here you can add your logic for creating a new group
    // Make a POST request to the API with the user's token, fullName, and email
    // @ts-expect-error
    const token = await getIdToken(auth.currentUser);

    await axios
      .post('/api/admin/create-new-group', {
        groupName,
        token,
      })
      .then(() => {
        setGroupName('');
        setLoading(false);
        toast({
          title: 'Success',
          description: 'Group Created Successfully',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((e) => {
        setLoading(false);

        console.error(e);
        toast({
          title: 'Something Went Wrong',
          description: 'Please contact us if this keeps on happening',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });
    // Reset the input field after creating the group
  };

  return (
    <>
      <Hero />
      <Heading margin="0 auto" mt={'10vh'} textAlign={'center'} mb={'5vh'}>
        Create a New Group
      </Heading>
      <Box mb={'30vh'}>
        {loading ? (
          <Box>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              pos="fixed"
              top={'45vh'}
              left={'48vw'}
            />
          </Box>
        ) : (
          <Box>
            {' '}
            <Box w="60vw" m="0 auto">
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel htmlFor="group-name">Group Name</FormLabel>
                  <Input
                    id="group-name"
                    placeholder="Enter group name"
                    value={groupName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <Button colorScheme="blue" onClick={handleCreateGroup}>
                  Create New Group
                </Button>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Index;

import { Box, Heading, Stack } from '@chakra-ui/react';

import { useAuthContext } from '@/firebase/auth-context';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }

  return (
    <>
      <Hero />
      <Heading
        margin="0 auto"
        mt={'10vh'}
        textAlign={'center'}
        mb={'30vh'}
        borderBottom={'6px double black'}
        display="table"
      >
        My Profile
      </Heading>
      <Box border="6px double black" p={20} w="70vw" m="0 auto" mb={20}>
        <Stack spacing={5}>
          <Heading>Name: {user.fullName}</Heading>
          <Heading>Email: {user.email}</Heading>
          <Heading>Group: {user.groupInfo?.groupName}</Heading>
        </Stack>
      </Box>
      <Footer />
    </>
  );
};

export default Index;

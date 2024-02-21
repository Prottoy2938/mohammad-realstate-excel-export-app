import { Box, Heading, Stack } from '@chakra-ui/react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const auth = getAuth();
  const [groupInfo, setGroupInfo] = useState(null);

  useEffect(() => {
    const fetchAllGroups = async () => {
      // fetching all groups
      // @ts-expect-error
      const token = await getIdToken(auth.currentUser);
      console.log(user);
      await axios
        .post('/api/get-user-group-info', { token, groupID: user.groupID })
        .then((res) => {
          setGroupInfo(res.data.groupData);
          console.log(res.data.groupData);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    fetchAllGroups();
  }, []);

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
        My Group
      </Heading>
      <Box border="6px double black" p={20} w="70vw" m="0 auto" mb={20}>
        <Stack spacing={5}>
          <Heading>Group Name: {user.groupName}</Heading>
          <Heading>Total Users: {user.totalUsers}</Heading>
        </Stack>
      </Box>
      <Footer />
    </>
  );
};

export default Index;

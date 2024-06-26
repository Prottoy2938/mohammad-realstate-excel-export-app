import { Box, Button, Heading, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import NewUsersTable from '../new-user-table-admin/new-user-table-admin';
import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const [allGroups, setAllGroups] = useState(null);
  const [newUsers, setNewUsers] = useState(null);
  const auth = getAuth();

  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/');
    }
    if (user && !user.userType.includes('admin')) {
      router.push('/dashboard');
    }

    const fetchAllGroups = async () => {
      // fetching all groups
      // @ts-expect-error
      const token = await getIdToken(auth.currentUser);
      await axios
        .post('/api/admin-get-new-users', { token })
        .then((res) => {
          setNewUsers(res.data.allData);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const fetchNewUsers = async () => {
      // fetching all groups
      // @ts-expect-error
      const token = await getIdToken(auth.currentUser);
      await axios
        .post('/api/admin-get-all-groups', { token })
        .then((res) => {
          setAllGroups(res.data.allData);
        })
        .catch((e) => {
          console.log(e);
        });
    };

    fetchNewUsers();

    fetchAllGroups();
  }, []);
  return (
    <>
      <Hero />
      <Box mb={'60vh'}>
        {user.userType == 'ultimate-admin' && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages
          <a href="/admin/create-new-group">
            <Button ml={10} mt={10} colorScheme="blue" px={10}>
              Create a New Group
            </Button>
          </a>
        )}
        {allGroups && newUsers ? (
          <Box mb={'10vh'} mt={20}>
            <Heading
              fontSize={'3xl'}
              m="0 auto"
              mb={10}
              mt={10}
              textAlign={'center'}
            >
              New User Awaiting Verification
            </Heading>
            <NewUsersTable allGroups={allGroups} newUsers={newUsers} />
          </Box>
        ) : (
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
        )}
      </Box>
      <Footer />
    </>
  );
};

export default Index;

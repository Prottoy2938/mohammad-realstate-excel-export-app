import { Button, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const [allGroups, setAllGroups] = useState(null);

  const toast = useToast();
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
        .post('/api/admin-get-all-groups', { token })
        .then((res) => {
          setAllGroups(res.data.allData);
          console.log(res.data);
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
      {user.userType == 'ultimate-admin' && (
        <a href="/admin/create-new-group">
          <Button size="lg" colorScheme="blue" px={20} variant="outline">
            Create a New Group
          </Button>
        </a>
      )}

      <Footer />
    </>
  );
};

export default Index;

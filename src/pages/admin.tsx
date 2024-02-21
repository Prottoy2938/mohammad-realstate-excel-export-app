import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
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

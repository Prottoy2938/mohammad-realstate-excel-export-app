'use client';

// pages/signup.tsx
// pages/signup.tsx

import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import {
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';

import { Hero } from '@/templates/Hero';

import firebase_app from '../firebase/config';
import { Footer } from '../templates/Footer';

const Signup = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (email && password && fullName) {
      const auth = getAuth(firebase_app);

      try {
        setLoading(true); // Set loading to true on button click

        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed up successfully
            const { user } = userCredential;
            // Get the user's token
            const token = await getIdToken(user);

            // Make a POST request to the API with the user's token, fullName, and email
            await axios
              .post('/api/create-user-account', {
                fullName,
                email,
                token,
              })
              .then(() => {
                router.push('/dashboard');
              })
              .catch((e) => {
                console.error(e);
                toast({
                  title: 'Something Went Wrong',
                  description: 'Please contact us if this keeps on happening',
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                });
              });
          })
          .catch((error) => {
            // Handle errors
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error creating user:', errorMessage);
          });
      } catch (error) {
        // Handle Firebase Authentication error
        console.error('Firebase Authentication error:', error);

        toast({
          title: 'Something Went Wrong',
          // @ts-expect-error
          description: error.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } finally {
        setLoading(false); // Set loading back to false after the process completes
      }
    } else {
      toast({
        title: 'Please fully fill out the form first',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Hero />
      <Center mb={20}>
        <VStack spacing={4} mt={8}>
          <Box p={8} maxW="md">
            <Heading mb={4}>Create an Account</Heading>
            <form onSubmit={handleSignup}>
              <FormControl>
                <FormLabel htmlFor="fullName">Full Name</FormLabel>
                <Input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                mt={4}
                isLoading={loading}
                spinnerPlacement="end"
              >
                Registesr
              </Button>
            </form>
          </Box>
        </VStack>
      </Center>
      <Footer />
    </>
  );
};

export default Signup;

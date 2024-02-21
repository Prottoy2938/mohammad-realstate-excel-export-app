'use client';

import { Box, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import type { User } from 'firebase/auth';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import firebase_app from '@/firebase/config';

// Initialize Firebase auth instance
const auth = getAuth(firebase_app);

// Create the authentication context
export const AuthContext = createContext({});

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({
  children,
}: AuthContextProviderProps): JSX.Element {
  // Set up state to track the authenticated user and loading status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        const token = await getIdToken(user);
        await axios
          .post('/api/get-user-data', {
            token,
          })
          .then((res) => {
            setUser(res.data.userData);
          })
          .catch((e) => {
            console.log(e);
            // after the user just opened the account in, the database might still be empty
            setUser(user);
            // alert("Something went wrong, if this keeps on happening please contact us")
          });
      } else {
        // User is signed out
        setUser(null);
      }
      // Set loading to false once authentication state is determined
      setLoading(false);
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user, setUser }}>
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
        children
      )}
    </AuthContext.Provider>
  );
}

import '../styles/global.css';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { AuthContextProvider } from '@/firebase/auth-context';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider>
    {' '}
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  </ChakraProvider>
);

export default MyApp;

import { Heading } from '@chakra-ui/react';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => (
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
    <Footer />
  </>
);

export default Index;

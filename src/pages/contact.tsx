import { Box } from '@chakra-ui/react';

import { Banner } from '@/templates/Banner';

import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => (
  <>
    <Hero />
    {/* <VerticalFeatures /> */}
    <Box mb={20}>
      <Banner />
    </Box>
    <Footer />
  </>
);

export default Index;

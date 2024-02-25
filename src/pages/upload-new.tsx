import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/firebase/auth-context';

import firebase_app from '../firebase/config';
import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push('/');
    }
    if (user && !user.isActive) {
      router.push('/');
    }
  }, []);

  // @ts-expect-error
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    setLoading(true);
    const storage = getStorage(firebase_app);
    // @ts-expect-error
    const storageRef = ref(storage, file.name);

    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      const response = await axios.post('/api/upload-new-file', {
        imageUrl: url,
        groupID: user.groupID,
        userUID: user.uid,
        userInfo: user,
      });
      // @ts-expect-error
      setImageUrl(url);
      console.log('Upload response:', response.data);
      setLoading(false);
      toast({
        title: 'Success',
        description: 'User added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      toast({
        title: 'Error',
        description: 'An error occurred while adding the user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
        Upload New File
      </Heading>
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
        <div>
          <Input type="file" onChange={handleFileChange} mb={4} />
          <Button colorScheme="blue" onClick={handleUpload}>
            Upload
          </Button>
          {imageUrl && (
            <div>
              <Heading as="h2" size="lg" mt={4} mb={2}>
                Uploaded Image
              </Heading>
              <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </div>
      )}
      <Footer />
    </>
  );
};

export default Index;

import { Button, Heading, Input } from '@chakra-ui/react';
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
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push('/');
    }
    if (user && !user.isActive) {
      router.push('/');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

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
    } catch (error) {
      console.error('Error uploading file:', error);
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
      <Footer />
    </>
  );
};

export default Index;

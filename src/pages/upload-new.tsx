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
import { v4 as uuidv4 } from 'uuid';

import { useAuthContext } from '@/firebase/auth-context';

import firebase_app from '../firebase/config';
import { Footer } from '../templates/Footer';
import { Hero } from '../templates/Hero';

const Index = () => {
  const [file, setFile] = useState(null);
  const [excelString, setExcelString] = useState([]);

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
  function exportToCsv(filename, rows) {
    // @ts-expect-error
    const processRow = function (row) {
      let finalVal = '';
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = `"${result}"`;
        if (j > 0) finalVal += ',';
        finalVal += result;
      }
      return `${finalVal}\n`;
    };

    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    // @ts-expect-error
    if (navigator.msSaveBlob) {
      // IE 10+
      // @ts-expect-error
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  const handleDownloadCSVFile = () => {
    exportToCsv(`${uuidv4()}.csv`, excelString);
  };

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
      setExcelString(response.data.excelString);
      setLoading(false);

      if (response.data.excelString.length) {
        toast({
          title: 'Success',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      } else {
        // toast({
        //   title:
        //     "Couldn't transcribe document, something went wrong. Please try again",
        //   status: 'error',
        //   duration: 9000,
        //   isClosable: true,
        // });
      }
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
        <Box mb={30} p={20}>
          <Input type="file" onChange={handleFileChange} mb={10} />
          <Button colorScheme="blue" onClick={handleUpload}>
            Upload
          </Button>

          {excelString.length ? (
            <Button
              colorScheme="green"
              style={{
                margin: '0 auto',
                marginTop: '30px',
                marginBottom: '30px',
                marginLeft: '45vw',
              }}
              onClick={handleDownloadCSVFile}
            >
              Download Transcribed Data
            </Button>
          ) : (
            ''
          )}

          {imageUrl && (
            <div>
              <Heading as="h2" size="lg" mt={4} mb={2}>
                Uploaded Image
              </Heading>
              <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
            </div>
          )}
        </Box>
      )}
      <Footer />
    </>
  );
};

export default Index;

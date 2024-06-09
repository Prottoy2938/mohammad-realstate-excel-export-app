import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useState } from 'react';

import firebase_app from '../firebase/config';

// Initialize Firebase
const storage = getStorage(firebase_app);
const db = getFirestore(firebase_app);

const CreateClient = () => {
  const [clientName, setClientName] = useState('');
  const [clientDetails, setClientDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleFileNameChange = (e, index) => {
    const newFileNames = [...fileNames];
    newFileNames[index] = e.target.value;
    setFileNames(newFileNames);
  };

  const handleFileDetailChange = (e, index) => {
    const newFileDetails = [...fileDetails];
    newFileDetails[index] = e.target.value;
    setFileDetails(newFileDetails);
  };

  const addFileField = () => {
    setFiles([...files, null]);
    setFileNames([...fileNames, '']);
    setFileDetails([...fileDetails, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload files to Firebase Storage and get their URLs
      const fileUploads = await Promise.all(
        files.map(async (file, index) => {
          const storageRef = ref(
            storage,
            `clients/${clientName}/${fileNames[index]}`,
          );
          await uploadBytes(storageRef, file);
          return getDownloadURL(storageRef);
        }),
      );

      // Prepare file data
      const fileData = fileNames.map((name, index) => ({
        name,
        detail: fileDetails[index],
        url: fileUploads[index],
      }));

      // Save client data to Firestore
      const docRef = await addDoc(collection(db, 'clients'), {
        name: clientName,
        details: clientDetails,
        files: fileData,
      });

      console.log('Document written with ID: ', docRef.id);

      // Show success toast
      toast({
        title: 'Success',
        description:
          "All files are added to the system, we're scanning them. You can leave this page.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect or give feedback to the user
      router.push('/');
    } catch (error) {
      console.error('Error uploading files or creating client: ', error);

      // Show error toast
      toast({
        title: 'An error occurred',
        description: 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl">
          Create New Client
        </Heading>
        <FormControl id="client-name" isRequired>
          <FormLabel>Client Name</FormLabel>
          <Input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </FormControl>
        <FormControl id="client-details" isRequired>
          <FormLabel>Client Details</FormLabel>
          <Textarea
            value={clientDetails}
            onChange={(e) => setClientDetails(e.target.value)}
          />
        </FormControl>
        {files.map((file, index) => (
          <Box key={index}>
            <FormControl id={`file-name-${index}`} isRequired>
              <FormLabel>File Name</FormLabel>
              <Input
                value={fileNames[index]}
                onChange={(e) => handleFileNameChange(e, index)}
              />
            </FormControl>
          giit  */}
            <FormControl id={`file-${index}`} isRequired>
              <FormLabel>File</FormLabel>
              <Input type="file" onChange={(e) => handleFileChange(e, index)} />
            </FormControl>
          </Box>
        ))}
        <Button onClick={addFileField}>Add Another File</Button>
        <Button colorScheme="teal" onClick={handleSubmit} isLoading={isLoading}>
          Create Client
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateClient;

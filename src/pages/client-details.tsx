import {
  Box,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import firebase_app from '@/firebase/config';

// @ts-expect-error
const db = getFirestore(firebase_app);

const ClientDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      if (id) {
        const docRef = doc(db, 'clients', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClient(docSnap.data());
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) {
    return (
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
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl">
          {client.name}
        </Heading>
        <Text>
          <strong>Details:</strong> {client.details ? client.details : ''}
        </Text>
        <Text>
          <strong>Created By:</strong> {client.createdbyUserUID}
        </Text>
        <Text>
          <strong>Created At:</strong>{' '}
          {client.createdAt
            ? new Date(client.createdAt.seconds * 1000).toLocaleString()
            : ''}
        </Text>
        <Text>
          <strong>Last Updated At:</strong>{' '}
          {client.lastUpdatedAt
            ? new Date(client.lastUpdatedAt.seconds * 1000).toLocaleString()
            : ''}
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Details</Th>
              <Th>Checked</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* @ts-expect-error */}
            {client.files.map((file, index) => (
              <Tr key={index}>
                <Td>{file.name}</Td>
                <Td>{file.detail}</Td>
                <Td>{file.checked ? 'Yes' : 'No'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default ClientDetails;

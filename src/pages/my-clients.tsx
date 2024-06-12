import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import firebase_app from '@/firebase/config';

import { Search } from '../search/Search';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// Initialize Firebase
// @ts-expect-error
const db = getFirestore(firebase_app);

const Clients = () => {
  const [clients, setClients] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const clientsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // @ts-expect-error
      setClients(clientsData);
      setLoading(false);
    };
    fetchClients();
  }, []);

  const data = {
    labels: clients.map((client: any) => client.name),
    datasets: [
      {
        label: 'Number of Files',
        data:
          clients.files && clients.files.length
            ? clients.map((client) => client.files.length)
            : [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Clients and Number of Files',
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={8}>
      <VStack spacing={4} align="stretch">
        <Heading
          as="h1"
          size="xl"
          m="auto"
          mb={'10vh'}
          borderBottom={'6px double black'}
          display="table"
        >
          My Clients
        </Heading>
        <Box>
          <Search />

          {/* <Line data={data} options={options} /> */}
        </Box>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Details</Th>
              <Th>Total Files</Th>
              <Th>View Files</Th>
            </Tr>
          </Thead>
          <Tbody>
            {clients.map((client: any) => (
              <Tr key={client.id}>
                <Td>{client.name}</Td>
                <Td>{client.details}</Td>
                <Td>
                  {client.files && client.files.length
                    ? client.files.length
                    : '0'}
                </Td>
                <Td>
                  <Button
                    colorScheme="green"
                    size="sm"
                    as="a"
                    href={`/client-files?id=${client.id}`}
                  >
                    View Files
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default Clients;

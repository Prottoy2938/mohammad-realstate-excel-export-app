import {
  Box,
  Button,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import { useEffect, useState } from 'react';

const NewUsersTable: React.FC<any> = ({ allGroups, newUsers }) => {
  const [selectedGroups, setSelectedGroups] = useState({});
  const toast = useToast();
  const auth = getAuth();
  useEffect(() => {
    console.log(newUsers, '<<<');
  }, []);

  const handleSave = async (user: any) => {
    // @ts-expect-error
    const token = await getIdToken(auth.currentUser);
    // @ts-expect-error
    const selectedGroup = selectedGroups[user.uid];
    if (!selectedGroup) {
      toast({
        title: 'Warning',
        description: 'Please select a group for the user.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await axios.post('/api/admin-add-new-user', {
        user,
        token,
        groupID: selectedGroup,
      });
      toast({
        title: 'Success',
        description: 'User added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding the user.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // @ts-expect-error
  const handleGroupChange = (event, uid) => {
    setSelectedGroups({
      ...selectedGroups,
      [uid]: event.target.value,
    });
  };

  return (
    <>
      {allGroups.length ? (
        <Box p={4}>
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Full Name</Th>
                <Th>Email</Th>
                <Th>Created At</Th>
                <Th>Group</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {newUsers.map((user: any) => (
                <Tr key={user.uid}>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    {/*  eslint-disable-next-line no-underscore-dangle */}
                    {new Date(user.createdAt._seconds * 1000).toLocaleString()}
                  </Td>
                  <Td>
                    <Select
                      placeholder="Select group"
                      onChange={(event) => handleGroupChange(event, user.uid)}
                    >
                      {allGroups.map((group: any) => (
                        <option key={group.groupID} value={group.groupID}>
                          {group.groupName}
                        </option>
                      ))}
                    </Select>
                  </Td>
                  <Td>
                    <Button colorScheme="blue" onClick={() => handleSave(user)}>
                      Save
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Heading size="md">No New User</Heading>
      )}
    </>
  );
};

export default NewUsersTable;

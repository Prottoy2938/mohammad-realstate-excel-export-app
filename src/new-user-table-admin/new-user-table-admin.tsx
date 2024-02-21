import {
  Box,
  Button,
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
import { useAuthContext } from '@/firebase/auth-context';
import { getAuth, getIdToken } from 'firebase/auth';
import { useState } from 'react';

const NewUsersTable = ({ allGroups, newUsers }) => {
  const [selectedGroups, setSelectedGroups] = useState({});
  const toast = useToast();
  const auth = getAuth();

  const handleSave = async (user: any) => {
    // @ts-expect-error
    const token = await getIdToken(auth.currentUser);

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
        groupInfo: selectedGroup,
        token,
        groupID: selectedGroup.groupID,
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
              <Td>{user.createdAt.toDate().toLocaleString()}</Td>
              <Td>
                <Select
                  placeholder="Select group"
                  onChange={(event) => handleGroupChange(event, user.uid)}
                >
                  {allGroups.map((group) => (
                    <option key={group.groupName} value={group.groupName}>
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
  );
};

export default NewUsersTable;

"use client";
// pages/appointments.js
import { useEffect, useState } from 'react';
import { Table, Thead,Heading, Tbody, VStack,Tr, Th, Td, TableCaption, Button, useToast, Box } from '@chakra-ui/react';
import axios from 'axios';
import { useAuthContext } from "@/context/AuthContext";
import { getAuth, getIdToken } from 'firebase/auth';


const AppointmentsPage = () => {
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }

  const [appointments, setAppointments] = useState({
    pendingAppointments: [],
    onGoingAppointments: [],
    completedAppointments: [],
    cancelledAppointments: [],
  });

  const toast = useToast();
  const auth = getAuth();
  const fetchData = async () => {
    try {
      // @ts-expect-error
      const token = await getIdToken(auth.currentUser);
      const response = await axios.post('/api/admin-get-all-appointments', 
      {token, email: userInfo.email}
      );
console.log(response.data['onGoingAppointments'])
      
      // console.log(response.data)
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };


  useEffect(() => {
   
    fetchData();
  }, []);

  const handleAction = async (appointment: any, actionType: any) => {
    try {
   // @ts-expect-error
   const token = await getIdToken(auth.currentUser);

      const response = await axios.post('/api/update-appointment-actiontype', {
        appointmentId: appointment.docId, // Assuming token is the unique identifier
        actionType,
        token,
        email: userInfo.email
      });

      await fetchData()

      // Handle success
      toast({
        title: 'Appointment updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Assuming the API returns the updated list of appointments
    } catch (error) {
      console.error('Error updating appointment:', error);

      // Handle error
      toast({
        title: 'Error updating appointment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderTable = (appointmentType: any, appointmentTitle: any) => (
    <>
    {/* @ts-expect-error */}
    {appointments && appointments[appointmentType] && appointments[appointmentType].length ? 
    <Box mb={6}  border="10px solid dashed">
        <Heading borderBottom="6px double black" display="table" fontSize={"2xl"} m="0 auto" textAlign={"center"} mt={10}  mb={20}>{appointmentTitle}</Heading>
      <Table m="0 auto" width={"90vw"} variant="simple" key={appointmentType}>
        <Thead>
          <Tr>
            <Th>Created At</Th>
            <Th>Appointer Name</Th>
            <Th>Assigned To</Th>
            <Th>Patient Name</Th>
            <Th>Patient Location</Th>
            <Th>Patient Contact</Th>
            <Th>Patient Meetup Time</Th>
            <Th>Appointment Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* {console.log(appointments[appointmentType])} */}
          {/* @ts-expect-error */}
          {appointments[appointmentType].map((appointment) => (
            <Tr key={appointment.docId}>
              <Td>{new Date(appointment.createdAt._seconds * 1000).toLocaleDateString()} {new Date(appointment.meetupTime._seconds * 1000).toLocaleTimeString()}</Td>
              <Td>{appointment.appointerName}</Td>
              <Td>{appointment.assignedToFullInfo?.fullName}</Td>
              <Td>{appointment.patientName}</Td>
              <Td>{appointment.location}</Td>
              <Td>{appointment.phoneNumber}</Td>
              <Td>{new Date(appointment.meetupTime._seconds * 1000).toLocaleDateString()} {new Date(appointment.meetupTime._seconds * 1000).toLocaleTimeString()}</Td>
              <Td>{appointment.status}</Td>




              <Td>
                {appointmentType === 'pendingAppointments' && (
                  <VStack  spacing={2}>
                    <Button size="sm" colorScheme='green' onClick={() => handleAction(appointment, 'ongoing')}>Accept</Button>
                    <Button size="sm" colorScheme='red' onClick={() => handleAction(appointment, 'cancelled')}>Cancel</Button>
                  </VStack>
                )}
                {appointmentType === 'onGoingAppointments' && appointment.status === 'ongoing' && (
                  <Button size="sm" colorScheme='blue' onClick={() => handleAction(appointment, 'completed')}>Complete</Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  : null}
    </>
   
  );

  return (
    <>
    
    <Heading  display="table" m="0 auto" mt={10} mb={10}>My Appointments</Heading>
    <Box mt={10}>
      {renderTable('pendingAppointments', "Pending Appointments")}
      {renderTable('onGoingAppointments', "On Going Appointments")}
      {renderTable('completedAppointments', "Completed Appointments")}
      {renderTable('cancelledAppointments', "Cancelled Appointments")}
    </Box>
    </>
  );
};

export default AppointmentsPage;

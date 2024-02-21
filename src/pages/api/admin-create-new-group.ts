// pages/api/addHealthcareWorker.ts

import admin from 'firebase-admin';
// pages/api/submitForm.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import verifyIdToken from '../../firebase/verify-token';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_EMAIL,
      // https://stackoverflow.com/a/41044630/1332513
      privateKey:
        // @ts-expect-error
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming JSON data
      const { groupName, token } = req.body;
      console.log(groupName);

      const userInfo = await verifyIdToken(token.toString());
      const adminSnapshot = await db
        .collection('users')
        .where('uid', '==', userInfo.uid)
        .get();
      // @ts-expect-error
      const adminDoc = adminSnapshot.docs[0].data();
      // Ensure the token's email matches the provided email
      if (adminDoc.userType != 'ultimate-admin') {
        res.status(401).json({ message: 'UnAuthorized' });
      }
      const groupID = uuidv4();
      await db
        .collection('groups')
        .doc(groupID)
        .set({
          groupName,
          groupID,
          createdByUID: userInfo.uid,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()),
          active: true,
        });
      // Here you can handle the incoming data, such as saving it to a database

      // Send a response
      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.log(error);
      // Handle errors
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

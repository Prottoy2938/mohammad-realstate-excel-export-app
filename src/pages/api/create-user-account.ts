// pages/api/addHealthcareWorker.ts

import admin from 'firebase-admin';
// pages/api/submitForm.ts
import type { NextApiRequest, NextApiResponse } from 'next';

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

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming JSON data
      const { fullName, email, token } = req.body;
      const userInfo = await verifyIdToken(token.toString());
      // Get data from the request body

      // Ensure the token's email matches the provided email
      if (userInfo.email !== email) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
        });
      }

      await db
        .collection('users')
        .doc(userInfo.uid)
        .set({
          fullName,
          email,
          uid: userInfo.uid,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()),
          isActive: false,
          userType: 'regular',
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

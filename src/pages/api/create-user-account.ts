// pages/api/addHealthcareWorker.ts

import admin from 'firebase-admin';
import { type NextRequest } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, token } = await request.json();
    const userInfo = await verifyIdToken(token.toString());
    // Get data from the request body

    // Ensure the token's email matches the provided email
    if (userInfo.email !== email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    await db.collection('users').add({
      fullName,
      email,
      uid: userInfo.uid,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
      isActive: true,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

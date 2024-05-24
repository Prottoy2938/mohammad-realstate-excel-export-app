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
      clientEmail: 'firebase-adminsdk-48lrx@realestate-project-d2fb8.iam.gserviceaccount.com',
      // https://stackoverflow.com/a/41044630/1332513
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9NcWx97aPNvcy\ndv7k0eGzAHSEKGnYe9JpAKYRRNylDfG6+6ipQggi8D07wJHe2EaeEyY38CQEUAIF\nBqlCh30WSSmC9eeDIf41h/P6TTkXsdGbq4r5dRt10tXYvD06Bi3LNGZkNlZetvor\nl1gNKni9VuQ4xMKlxSvfJsnnpiX5qaqXM7RAWSE98juFY8MI9T8kFfBxEjGP3kvE\n2c7c+kQixD+mUPTOKsWVEj4NOLc8vrEZztR7t2jnUU31f614muEVTyEW7Qo21sT4\niZTSNEzvC2mB28u4+usGK9ZtBMIvMU4ZOfrlxDQFdeC+8coZ+0deUb2vpnb4Vdbz\nLH6l7avTAgMBAAECggEAAnVV5buNtCunJ5EzO57ce1poqSTrRyRIthOLlNLbuQtG\n1kKZzOUuPOH5MbMNUiNmO3yNNRHaLfIqLI2LGnGvNuBpeSmfwezppCFpkpl5Qe0O\nB6NBcX9LhYrhO2kqtHvLEYZTRD8OfTmMY4+aVcV0/yTHX1NzIfs/WC1lVyyp9qXv\nbVJ2Jw+iL8l/qCnoIwE67v6A57ExqPOgdANyvhYUFwMPfBlg1qDpeESZ2uSB7tjO\nfoxOudr0seGsixPjl8yGD6Q/L86+ofls5FJVnbxzWGOjEsUDMcg3rIZ5c20LQmmO\nMyoQV2arW2lhij8Q1ezz4HPvBFGHbRVz6bdItPopeQKBgQD5jFcP+Mwpvg8SGddY\n6jG+CY0HhGjKCQtutD6PlbbN0apI3oA3jkp5JUmCXOuO/ZaSbmUr/qFaKz9IAAbw\n0sIQw18xyZWmQjA0PEP94+2lzurARXU04NvFDxrMDMnSkBbcUv8CG9gn3DLlBv33\nQWDOEe1o0QWxyAufQaX5eTJF6QKBgQDCGhP32i4J3OGs52U9gDaFGEyCpWD+Qb0+\n4gk05U6Ieoub7/4n05F/8X3V2MeSkZyq9u82fq9fNNG1KOcFzHHidZ8c1Wd+MkP+\nZZ4mBFp4ktRO64BOJlDrHaer2ktD9z+KXHlaqNkHehBWxqb74woSp/7fZEBW984N\nQGxjH4sCWwKBgQCCdA7/VnzERYrzV3bwEF24jp2fFGUDWP8U/DzIKufJaJWwSkCU\nylm8QvXOpGyv73lLS1KwUQhgbsNCDGGUe1jgEoItMMh+hZNVezu/+es+BpFJugWv\nguzgcyj7CqRm4tRQkUKmA5BYJhClEaaqHw9QKqcFaF+ltIH+2v69D9JsIQKBgBAz\nWQNQ5JLSKsvhrGOLtgE52/jzkLroBcGf4CDYGsvtXoWvbEkqsXQ6VcRpiY7ENI1Y\nevLTdBPANtimB1JGlCLQqm0fqrmvvFkZZi/KITr7FllX8qeTLyHQodQILkwH8Pe9\nbCuS+DpVh9OWVQ2lD4wrFWzT00Lu//W/MMy9Lz8NAoGBANpBj2FBKzRtAdhUJcON\nm/rjSzXwVGMp/eUT6pn+7Ay1vPb+UJNEiJV7eBYYEOH9f8UhNaxlM7jLNuWHcV7N\nQkx0YBwiFhtuIVH5Ra9TcccIUP4rhifJ/jmx1lZzR7Hy6J5layu0CTEUVej5nqQQ\nf7OPBVdIDGaU7ua1up3+aBIx\n-----END PRIVATE KEY-----\n'.replace(/\\n/g, '\n'),
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
          totalUsers: 0,
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

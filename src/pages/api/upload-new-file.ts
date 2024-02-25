// pages/api/addHealthcareWorker.ts

import admin from 'firebase-admin';
// pages/api/submitForm.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

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

function extractFullString(array) {
  let fullString = '';
  for (const obj of array) {
    if (obj.message && obj.message.content) {
      fullString += obj.message.content;
    }
  }
  return fullString;
}

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    try {
      // Parse the incoming JSON data
      const { groupID, imageUrl, userUID, userInfo } = req.body;
      const openai = new OpenAI({
        apiKey: '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',
      });
      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        max_tokens: 3500,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Try to summarize whats in this image in a excel table form. Try to gather as much information as possible. My goal isto save the output string as an excel file. So only output in an array format similar to this: 
              [
                ["Name", "Age", "Gender", "City", "Phone"],
                ["John", 30, "Male", "NYC", 123456],
                ["Alice", 25, "Female", "LA", 789012]
            ]
              `,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });
      console.log(extractFullString(response.choices)); // Output: "Hello world! This is a test."

      const docID = uuidv4();

      await db
        .collection('files')
        .doc(docID)
        .set({
          docId: docID,
          groupID,
          imageUrl,
          createdByUser: userUID,
          userInfo,
          createdAt: admin.firestore.Timestamp.fromDate(new Date()),
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

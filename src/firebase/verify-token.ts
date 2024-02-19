import * as admin from 'firebase-admin';

const verifyIdToken = (token: string) => {
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

  return admin
    .auth()
    .verifyIdToken(token) // auth.verifyIidToken
    .catch((error: any) => {
      throw error;
    });
};

export default verifyIdToken;

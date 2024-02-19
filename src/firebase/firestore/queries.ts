import {
  collection,
  doc,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import firebase_app from '../config';

// Get the Firestore instance
// @ts-expect-error
const db = getFirestore(firebase_app);

const articleQuery = query(
  collection(db, 'articles'),
  orderBy('order'),
  limit(3),
);
const openAIKeyDoc = doc(db, 'APIKeys', 'openai-keys');
const openAIQueryDoc = doc(db, 'queries', 'openai-queries');
const boostedLinksQuery = (linkID: string): any => {
  return query(
    collection(db, 'boosted-links'),
    where('id', '==', linkID),
    limit(1),
  );
};

export { articleQuery, boostedLinksQuery, openAIKeyDoc, openAIQueryDoc };

const express = require('express');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: 'realestate-project-d2fb8',
      clientEmail: 'firebase-adminsdk-48lrx@realestate-project-d2fb8.iam.gserviceaccount.com',
      // https://stackoverflow.com/a/41044630/1332513
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9NcWx97aPNvcy\ndv7k0eGzAHSEKGnYe9JpAKYRRNylDfG6+6ipQggi8D07wJHe2EaeEyY38CQEUAIF\nBqlCh30WSSmC9eeDIf41h/P6TTkXsdGbq4r5dRt10tXYvD06Bi3LNGZkNlZetvor\nl1gNKni9VuQ4xMKlxSvfJsnnpiX5qaqXM7RAWSE98juFY8MI9T8kFfBxEjGP3kvE\n2c7c+kQixD+mUPTOKsWVEj4NOLc8vrEZztR7t2jnUU31f614muEVTyEW7Qo21sT4\niZTSNEzvC2mB28u4+usGK9ZtBMIvMU4ZOfrlxDQFdeC+8coZ+0deUb2vpnb4Vdbz\nLH6l7avTAgMBAAECggEAAnVV5buNtCunJ5EzO57ce1poqSTrRyRIthOLlNLbuQtG\n1kKZzOUuPOH5MbMNUiNmO3yNNRHaLfIqLI2LGnGvNuBpeSmfwezppCFpkpl5Qe0O\nB6NBcX9LhYrhO2kqtHvLEYZTRD8OfTmMY4+aVcV0/yTHX1NzIfs/WC1lVyyp9qXv\nbVJ2Jw+iL8l/qCnoIwE67v6A57ExqPOgdANyvhYUFwMPfBlg1qDpeESZ2uSB7tjO\nfoxOudr0seGsixPjl8yGD6Q/L86+ofls5FJVnbxzWGOjEsUDMcg3rIZ5c20LQmmO\nMyoQV2arW2lhij8Q1ezz4HPvBFGHbRVz6bdItPopeQKBgQD5jFcP+Mwpvg8SGddY\n6jG+CY0HhGjKCQtutD6PlbbN0apI3oA3jkp5JUmCXOuO/ZaSbmUr/qFaKz9IAAbw\n0sIQw18xyZWmQjA0PEP94+2lzurARXU04NvFDxrMDMnSkBbcUv8CG9gn3DLlBv33\nQWDOEe1o0QWxyAufQaX5eTJF6QKBgQDCGhP32i4J3OGs52U9gDaFGEyCpWD+Qb0+\n4gk05U6Ieoub7/4n05F/8X3V2MeSkZyq9u82fq9fNNG1KOcFzHHidZ8c1Wd+MkP+\nZZ4mBFp4ktRO64BOJlDrHaer2ktD9z+KXHlaqNkHehBWxqb74woSp/7fZEBW984N\nQGxjH4sCWwKBgQCCdA7/VnzERYrzV3bwEF24jp2fFGUDWP8U/DzIKufJaJWwSkCU\nylm8QvXOpGyv73lLS1KwUQhgbsNCDGGUe1jgEoItMMh+hZNVezu/+es+BpFJugWv\nguzgcyj7CqRm4tRQkUKmA5BYJhClEaaqHw9QKqcFaF+ltIH+2v69D9JsIQKBgBAz\nWQNQ5JLSKsvhrGOLtgE52/jzkLroBcGf4CDYGsvtXoWvbEkqsXQ6VcRpiY7ENI1Y\nevLTdBPANtimB1JGlCLQqm0fqrmvvFkZZi/KITr7FllX8qeTLyHQodQILkwH8Pe9\nbCuS+DpVh9OWVQ2lD4wrFWzT00Lu//W/MMy9Lz8NAoGBANpBj2FBKzRtAdhUJcON\nm/rjSzXwVGMp/eUT6pn+7Ay1vPb+UJNEiJV7eBYYEOH9f8UhNaxlM7jLNuWHcV7N\nQkx0YBwiFhtuIVH5Ra9TcccIUP4rhifJ/jmx1lZzR7Hy6J5layu0CTEUVej5nqQQ\nf7OPBVdIDGaU7ua1up3+aBIx\n-----END PRIVATE KEY-----\n'.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}


const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

function extractFullString(array) {
  let fullString = '';
  for (const obj of array) {
    if (obj.message && obj.message.content) {
      fullString += obj.message.content;
    }
  }
  return fullString;
}

function extractAndConvertToArray(input) {
  const regex = /```([\s\S]*)```/;
  const match = input.match(regex);
  if (match && match.length > 1) {
    const extractedString = match[1].trim();
    try {
      const arrayData = JSON.parse(extractedString);
      if (Array.isArray(arrayData)) {
        return arrayData;
      }
      return [];
    } catch (error) {
      console.error('Error parsing extracted string:', error);
      return [];
    }
  } else {
    return [];
  }
}

async function getExcelStringFromGPT(imageUrl) {
  try {
    const openai = new OpenAI({
      apiKey: '',
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
              text: `Try to summarize what's in this image in an excel table form. Try to gather as much information as possible. My goal is to save the output string as an excel file. So only output in an array format similar to this: 
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
    const excelString = extractAndConvertToArray(
      extractFullString(response.choices)
        .replace(/\n/g, '')
        .replace(/plaintext\n/g, '')
    );

    return excelString;
  } catch (e) {
    console.error('Error fetching data from GPT:', e);
    return [];
  }
}

app.post('/uploadNewFileTwo', async (req, res) => {
  try {
    console.log('runnign here')
    const { groupID, imageUrl, userUID, userInfo } = req.body;
    let excelString = await getExcelStringFromGPT(imageUrl);

    while (!excelString.length) {
      console.log('Retrying GPT request...');
      excelString = await getExcelStringFromGPT(imageUrl);
    }

    const docID = uuidv4();

    await db.collection('files').doc(docID).set({
      docId: docID,
      groupID,
      excelString: JSON.stringify(excelString),
      imageUrl,
      createdByUser: userUID,
      userInfo,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    });

    res.status(200).json({ excelString });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET request handler for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// GET request handler for the homepage
app.get('/uploadNewFileTwo', (req, res) => {
  
  res.send('Welcome to the homepag de!');
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

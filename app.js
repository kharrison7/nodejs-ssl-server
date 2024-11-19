const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;
const cors = require('cors');

// setup based on: https://youtu.be/FTNKDgN4CGI?t=244
const version = '1.3.0';

// 👇️ CORS https://bobbyhadz.com/blog/react-axios-network-error-stack-trace
app.use(cors());

app.use(express.json());

// JRS-10145 - AWS Cognito Setup:
const AWS = require('aws-sdk');
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;

const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const USER_POOL_ID = 'us-east-1_RustS1wQw';
const CLIENT_ID = 'icr4m3mloikrk60io9hgdh9dr';

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // for local running endpoint
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header(
        'Access-Control-Allow-Methods',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
      res.header(
        'Access-Control-Allow-Methods',
        'Origin, X-Requested-With, Content-Type, Accept',
      );
    next();
});

app.get('/', async (req, res) => {
  return res.status(200).send({
    value: 'test get value 10-30 V3 in app.js',
    message: 'can get',
  });
});

// JRS-10145 - AWS Cognito Setup for login vvv
async function loginUser(username, password) {
  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const authResponse = await cognito.initiateAuth(params).promise();
    return authResponse.AuthenticationResult; // contains IdToken, AccessToken, RefreshToken
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const authResult = await loginUser(username, password);
    res.json(authResult);
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
});
// JRS-10145 - AWS Cognito Setup for Login ^^^

app.get('/equipment/:id', async (req, res) => {
  console.log('hit equipment');
  console.log(req.params);
  console.log(req.params.id);

  const url = require('url');
  const url_parts = url.parse(req.url, true);
  const query = url_parts.query;

  console.log('url_parts', url_parts);
  console.log('query', query);

  return res.status(200).send({
    value: query,
    reqParams: req.params,
    url,
    message: 'can get equipment!',
  });
});

const items = [
  {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
  },
  {
      id: '1001',
      code: 'nvklal433',
      name: 'Black Watch',
      description: 'Product Description',
      image: 'black-watch.jpg',
      price: 72,
      category: 'Accessories',
      quantity: 61,
      inventoryStatus: 'INSTOCK',
      rating: 4
  },
  {
      id: '1002',
      code: 'zz21cz3c1',
      name: 'Blue Band',
      description: 'Product Description',
      image: 'blue-band.jpg',
      price: 79,
      category: 'Fitness',
      quantity: 3,
      inventoryStatus: 'LOWSTOCK',
      rating: 3
  },
  {
    id: '1005',
    code: 'av2231fwg',
    name: 'Brown Purse',
    description: 'Product Description',
    image: 'brown-purse.jpg',
    price: 120,
    category: 'Accessories',
    quantity: 0,
    inventoryStatus: 'OUTOFSTOCK',
    rating: 4
  },
  {
      id: '1026',
      code: 'bib36pfvm',
      name: 'Chakra Bracelet',
      description: 'Product Description',
      image: 'chakra-bracelet.jpg',
      price: 32,
      category: 'Accessories',
      quantity: 5,
      inventoryStatus: 'LOWSTOCK',
      rating: 3
  },
  {
    id: '1099',
    code: 'bib36pfvm',
    name: 'Chakra Bracelet Large',
    description: 'Product Description',
    image: 'chakra-bracelet.jpg',
    price: 32,
    category: 'Accessories',
    quantity: 5,
    inventoryStatus: 'LOWSTOCK',
    rating: 3
  }
];

app.get('/items', async (req, res) => {
  return res.status(200).send({
    value: items,
    message: 'can get items after update 10:00am!',
  });
});

app.get('/location', async (req, res) => {
  return res.status(200).send({
    value: items,
    message: 'can get items!',
  });
});

// Health check
app.get('/health', (req, res) => {    
    res.sendStatus(200);
    console.log(`[Version ${version}]: New request => http://${hostname}:${port}`+req.url);
})

app.listen(port, () => {
    console.log(`[Version ${version}]: Server running at http://${hostname}:${port}/`);
})

app.post('/post', async (req, res) => {
  console.log(req.body);
  return res.status(200).send({
    value: req.body,
    message: 'post success',
  });
});

try {
  app.listen(PORT, () => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}

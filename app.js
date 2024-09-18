const express = require('express');
const app = express();
const hostname = '127.0.0.1'; // Your server ip address
const port = 3000;
const cors = require('cors');

// setup based on: https://youtu.be/FTNKDgN4CGI?t=244
const version = '1.3.0';

// Original page provided
// app.get('/', (req, res) => {
//     // set response content    
//     res.sendFile(__dirname + "/html/index.html"); 
//     console.log(`[Version ${version}]: New request => http://${hostname}:${port}`+req.url);
// })

// 👇️ CORS https://bobbyhadz.com/blog/react-axios-network-error-stack-trace
app.use(cors());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // for register local running endpoint
    // res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
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

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  return res.status(200).send({
    value: 'test get value 9-17 in app.js',
    message: 'can get',
  });
});

app.get('/equipment', async (req, res) => {
  return res.status(200).send({
    value: 'test get value for equipment',
    message: 'can get equipment!',
  });
});

const items =[
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
  }
];

app.get('/items', async (req, res) => {
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

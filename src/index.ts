import express, { Application, Request, Response } from 'express';
const app: Application = express();
const PORT = 3000;
const cors = require('cors');
const hostname = '127.0.0.1'; // Your server ip address

// setup based on: https://youtu.be/FTNKDgN4CGI?t=244
const version = '1.0.0';

// setup based on: https://www.youtube.com/watch?v=nawJwaPW1yI
// Dockerfile.dev used to simplify running locally with the compose file (handles last 3 lines of base Dockerfile)
// The prod version yml includes the build step

// // TODO: can setup bodyParser in container installation:
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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


app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    value: 'test get value 2.1 in index.ts',
    message: 'get successful',
  });
});

app.post('/post', async (req: Request, res: Response): Promise<Response> => {
  console.log(req.body);
  return res.status(200).send({
    value: 'test post value',
    message: 'post successful!',
  });
});

// Health check
app.get('/health', (req, res) => {    
  res.sendStatus(200);
  console.log(`[Version ${version}]: New request => http://${hostname}:${PORT}`+req.url);
})


try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
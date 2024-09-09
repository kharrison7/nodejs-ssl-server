import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
const app: Application = express();
const PORT = 3000;

// setup based on: https://www.youtube.com/watch?v=nawJwaPW1yI
// Dockerfile.dev used to simplify running locally with the compose file (handles last 3 lines of base Dockerfile)
// The prod version yml includes the build step

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello World Updated!',
  });
});

app.post('/post', async (req: Request, res: Response): Promise<Response> => {
  console.log(req.body);
  return res.status(200).send({
    message: 'Hello World from post !',
  });
});

try {
  app.listen(PORT, (): void => {
    console.log(`Connected successfully on port ${PORT}`);
  });
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
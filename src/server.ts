import Fastify from 'fastify';
import { MongoClient } from 'mongodb';

const fastify = Fastify();
const FALLBACK_URI = 'mongodb+srv://kharrison:D8S1KUncQnkyml2C@dev-cluster.xl05m.mongodb.net/?retryWrites=true&w=majority';
const MONGO_URI = process.env.MONGO_URI || FALLBACK_URI;

const client = new MongoClient(MONGO_URI);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

fastify.get('/data', async (_, reply) => {
    const db = client.db('organization'); 
    const collection = db.collection('profiles'); 
    const data = await collection.find().toArray();
    return reply.send(data);
});

fastify.listen({ port: 3000 }, () => console.log('Server running on port 3000'));

connectDB();

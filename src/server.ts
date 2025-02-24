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

interface ProfileQuery {
    name: string;
}

fastify.get<{ Querystring: ProfileQuery }>('/profiles', async (request, reply) => {
    try {
        const { name } = request.query;

        if (!name) {
            return reply.status(400).send({ error: 'Name query parameter is required' });
        }

        const db = client.db('organization');
        const collection = db.collection('profiles');
        const profile = await collection.findOne({ name });

        if (!profile) {
            return reply.status(404).send({ error: 'Profile not found' });
        }

        return reply.send(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
});

fastify.listen({ port: 3000 }, () => console.log('Server running on port 3000'));

connectDB();

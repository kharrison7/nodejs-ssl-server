"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mongodb_1 = require("mongodb");
const fastify = (0, fastify_1.default)();
const FALLBACK_URI = 'mongodb+srv://kharrison:D8S1KUncQnkyml2C@dev-cluster.xl05m.mongodb.net/?retryWrites=true&w=majority';
const MONGO_URI = process.env.MONGO_URI || FALLBACK_URI;
const client = new mongodb_1.MongoClient(MONGO_URI);
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
    }
}
fastify.get('/profiles', async (request, reply) => {
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
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        return reply.status(500).send({ error: 'Internal Server Error' });
    }
});
fastify.listen({ port: 3000 }, () => console.log('Server running on port 3000'));
connectDB();

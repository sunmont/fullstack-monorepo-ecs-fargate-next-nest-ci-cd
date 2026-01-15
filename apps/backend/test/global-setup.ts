import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export default async function globalSetup() {
    if (process.env.NODE_ENV === 'test') {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        process.env.MONGODB_URI = mongoUri;

        // Set up global variables
        (global as any).__MONGO_URI__ = mongoUri;
        (global as any).__MONGO_SERVER__ = mongoServer;
    }
}
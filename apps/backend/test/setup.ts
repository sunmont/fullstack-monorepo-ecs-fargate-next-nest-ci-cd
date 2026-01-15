import mongoose from 'mongoose';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') {
        await mongoose.connect(process.env.MONGODB_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
});

afterAll(async () => {
    if (process.env.NODE_ENV === 'test') {
        await mongoose.disconnect();
    }

    if (app) {
        await app.close();
    }
});

afterEach(async () => {
    if (process.env.NODE_ENV === 'test') {
        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// Helper to create testing module
export const createTestingModule = async (modules: any[]) => {
    const moduleRef = await Test.createTestingModule({
        imports: modules,
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    return { app, moduleRef };
};
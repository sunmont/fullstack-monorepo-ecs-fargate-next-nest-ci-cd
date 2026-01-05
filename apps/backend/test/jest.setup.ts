import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';

let mongoServer: MongoMemoryServer;
let app: INestApplication;

export const setupTestApp = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleRef = await Test.createTestingModule({
        imports: [
            MongooseModule.forRoot(mongoUri),
            // Import your modules here
        ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    return app;
};

export const teardownTestApp = async () => {
    if (app) {
        await app.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

export const createTestUser = () => {
    return {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
    };
};

export const createAuthToken = (user: any) => {
    return jwt.sign(
        { sub: user._id, email: user.email, role: user.role },
        'test-secret',
    );
};

export const getAuthenticatedRequest = (app: INestApplication, token?: string) => {
    const authToken = token || createAuthToken(createTestUser());
    return request(app.getHttpServer())
        .set('Authorization', `Bearer ${authToken}`);
};
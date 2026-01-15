import * as mongoose from 'mongoose';

export default async function globalTeardown() {
    if (process.env.NODE_ENV === 'test') {
        await mongoose.disconnect();

        if ((global as any).__MONGO_SERVER__) {
            await (global as any).__MONGO_SERVER__.stop();
        }
    }
}
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';

@Module({
    imports: [
        // Configuration module
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // MongoDB connection
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/fullstack'),
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }),
            inject: [ConfigService],
        }),

        // Rate limiting
        ThrottlerModule.forRoot([
            {
                ttl: 60000, // 1 minute
                limit: 100, // 100 requests per minute
            },
        ]),

        // Feature modules
        AuthModule,
        UsersModule,
        PostsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
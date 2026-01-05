import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private redis: Redis.Redis;

    constructor(private configService: ConfigService) {
        this.redis = new Redis({
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
        });
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const clientIp = req.ip || req.connection.remoteAddress;
        const endpoint = req.originalUrl || req.url;
        const method = req.method;

        // Different rate limits for different endpoints
        const limits = {
            '/api/auth/login': { window: 900, max: 5 }, // 5 attempts per 15 minutes
            '/api/auth/register': { window: 3600, max: 3 }, // 3 registrations per hour
            default: { window: 60, max: 100 }, // 100 requests per minute
        };

        const limit = limits[endpoint] || limits.default;
        const key = `rate-limit:${clientIp}:${endpoint}:${method}`;

        try {
            const current = await this.redis.incr(key);

            if (current === 1) {
                await this.redis.expire(key, limit.window);
            }

            const ttl = await this.redis.ttl(key);

            // Set rate limit headers
            res.setHeader('X-RateLimit-Limit', limit.max.toString());
            res.setHeader('X-RateLimit-Remaining', Math.max(0, limit.max - current).toString());
            res.setHeader('X-RateLimit-Reset', ttl.toString());

            if (current > limit.max) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.TOO_MANY_REQUESTS,
                        message: 'Too many requests, please try again later.',
                        retryAfter: ttl,
                    },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            next();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            // If Redis fails, continue without rate limiting
            next();
        }
    }
}
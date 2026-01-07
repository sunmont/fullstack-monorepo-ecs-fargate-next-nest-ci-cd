import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getInfo(): object {
    return {
      name: "FullStack Monorepo API",
      version: "1.0.0",
      description:
        "Professional FullStack application with Next.js and Nest.js",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    };
  }

  healthCheck(): object {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get API information" })
  @ApiResponse({ status: 200, description: "API information" })
  getInfo() {
    return this.appService.getInfo();
  }

  @Public()
  @Get("health")
  @ApiOperation({ summary: "Health check endpoint" })
  @ApiResponse({ status: 200, description: "Service is healthy" })
  healthCheck() {
    return this.appService.healthCheck();
  }
}

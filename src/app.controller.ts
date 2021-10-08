import { Request, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService, HelloResponse } from './app.service';
import { LocalAuthGuard } from './users/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return this.appService.appStatus();
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  appStatus(): HelloResponse {
    return { status: 'OK!' }; // because everything is always ok
  }
}

export interface HelloResponse {
  status: string;
}

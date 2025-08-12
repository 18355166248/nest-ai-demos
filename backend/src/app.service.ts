import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '流式响应后端服务正在运行！';
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamingController } from './streaming/streaming.controller';
import { StreamingService } from './streaming/streaming.service';

@Module({
  imports: [],
  controllers: [AppController, StreamingController],
  providers: [AppService, StreamingService],
})
export class AppModule {}

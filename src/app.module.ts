import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';

@Module({
  imports: [],
  providers: [AppService, AppGateway],
})
export class AppModule {}

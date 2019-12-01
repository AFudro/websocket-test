import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { AppService } from './app.service';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway {
  constructor(private readonly appService: AppService) {}

  @SubscribeMessage('events')
  public handleEvent(client: Socket, data: string): WsResponse<string> {
    const event = 'events';
    return { event, data: this.appService.getHello() };
  }
}

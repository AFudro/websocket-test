import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppGateway } from '../src/app.gateway';
import * as io from 'socket.io-client';
import { AppService } from '../src/app.service';

const url = `http://localhost:3000`;

export class AppServiceMock {
  getHello(): string {
    return 'mocked';
  }
}

async function createNestApp(): Promise<INestApplication> {
  const appServiceMock = new AppServiceMock();
  const testingModule = await Test.createTestingModule({
    providers: [AppGateway, AppService],
  })
    .overrideProvider(AppService)
    .useValue(appServiceMock)
    .compile();
  const app = await testingModule.createNestApplication();
  // app.useWebSocketAdapter(new WsAdapter(app) as any);
  return app;
}

describe('WebSocketGateway (WsAdapter)', () => {
  let app;

  beforeAll(async () => {
    app = await createNestApp();
    await app.listenAsync(3000);
  });

  it('should connect', async done => {
    const socket = io(url, { reconnection: false });
    socket.on('connect', data => {
      expect(true).toBe(true);
      done();
    });

    socket.on('connect_error', data => {
      expect(true).toBe(false);
      done();
    });
  });

  // it('should get welcome', async done => {
  //   const socket = io(url, { reconnection: false });
  //   socket.on('connect', data => {
  //     socket.emit('events', 'hello');
  //   });
  //   socket.on('events', data => {
  //     expect(data).toBe('Hello World!');
  //     done();
  //   });
  // });

  it('should get mocked response', async done => {
    const socket = io(url, { reconnection: false });
    socket.on('connect', data => {
      socket.emit('events', 'hello');
    });
    socket.on('events', data => {
      expect(data).toBe('mocked');
      done();
    });
  });
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomStrategy } from '@nestjs/microservices';
import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.set('trust proxy', true);

  const configService = app.get(ConfigService);
  const options: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: [configService.get('NATS_URL')],
        name: 'products-listener',
      },
      consumerOptions: {
        deliverGroup: 'products-group',
        durable: 'products-durable',
        deliverTo: 'products-messages',
        manualAck: true,
        deliverPolicy: 'All',
      },
      streamConfig: {
        name: 'products_stream',
        subjects: ['line.*'],
      },
    }),
  };
  const microservice = app.connectMicroservice(options);
  microservice.listen();
  await app.listen(3000);
}
bootstrap();

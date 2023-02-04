import { NatsJetStreamServer } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CustomStrategy } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const options: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: [configService.get('NATS_URL')],
        name: 'purchase-order-listener',
      },
      consumerOptions: {
        deliverGroup: 'purchase-orders-group',
        durable: 'purchase-orders-durable',
        deliverTo: 'purchase-orders-messages',
        manualAck: true,
        deliverPolicy: 'All',
      },
      streamConfig: {
        name: 'mantainer_stream',
        subjects: ['product.*'],
      },
    }),
  };
  const microservice = app.connectMicroservice(options);
  microservice.listen();
  await app.listen(3000);
}
bootstrap();

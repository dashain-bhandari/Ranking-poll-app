import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PollModule } from './poll/poll.module';
import { socketGateway } from './socket/socket.gateway';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://dash:hiitsme@cluster0.eyhxjtn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),JwtModule.register({
    global: true,
    secret: "secret",
    signOptions: { expiresIn: '3d' },
  }),PollModule],
  controllers: [AppController],
  providers: [AppService,socketGateway],
})
export class AppModule {}

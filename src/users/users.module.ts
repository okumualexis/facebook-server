import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/user';
import { ProfileModule } from './profile/profile.module';
import { ConfirmPasswordMiddleware } from './middlewares/password-confirm.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ConfirmPasswordMiddleware).forRoutes({
      path: 'users',
      method: RequestMethod.POST,
    });
  }
}

import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../typeorm/profile';
import { User } from '../typeorm/user';
import { ProfilePic } from '../typeorm/profile.pic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User, ProfilePic])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}

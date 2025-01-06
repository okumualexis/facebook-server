import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateUserProfile } from '../dtos/createProfile.dto';
import { CreateProfilePicDto } from '../dtos/createProfilePic.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post(':userId')
  creatProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body()
    body: {
      userProfile: CreateUserProfile;
      profileData: CreateProfilePicDto;
    },
  ) {
    return this.profileService.createProfile(
      userId,
      body.userProfile,
      body.profileData,
    );
  }
}

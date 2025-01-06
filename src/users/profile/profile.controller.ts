import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateUserProfile } from '../dtos/createProfile.dto';
import { CreateProfilePicDto } from '../dtos/createProfilePic.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('profile'))
  async creatProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      userProfile: CreateUserProfile;
      profileData: CreateProfilePicDto;
    },
  ) {
    if (file) {
      try {
        const url = await this.profileService.uploadToCloudinary(file.buffer);
        if (!body.profileData) {
          body.profileData.image = '';
        }
        body.profileData.image = url;
      } catch (error) {
        throw new Error(`Profile upload failed, ${error}`);
      }
    }
    return this.profileService.createProfile(
      userId,
      body.userProfile,
      body.profileData,
    );
  }
}

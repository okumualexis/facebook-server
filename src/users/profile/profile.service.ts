import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../typeorm/profile';
import { Repository } from 'typeorm';
import { CreateUserProfile } from '../dtos/createProfile.dto';
import { User } from '../typeorm/user';
import { ProfilePic } from '../typeorm/profile.pic.entity';
import { CreateProfilePicDto } from '../dtos/createProfilePic.dto';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfilePic)
    private imageRepository: Repository<ProfilePic>,
    private configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUD_NAME'),
      api_key: configService.get<string>('API_KEY'),
      api_secret: configService.get<string>('API_SECRET'),
    });
  }

  async createProfile(
    userId: number,
    userProfile: CreateUserProfile,
    profileData: CreateProfilePicDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('User not found!');

    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['image'],
    });

    if (!profile) {
      const newProfile = this.profileRepository.create({
        user,
        ...userProfile,
      });
      await this.profileRepository.save(newProfile);
    } else {
      Object.assign(profile, userProfile);
      await this.profileRepository.save(profile);
    }

    if (!profileData) {
      throw new Error('Profile data not provided');
    }

    const image = Array.isArray(profileData.image)
      ? profileData.image
      : [profileData.image ?? ''];

    const profilePic = this.imageRepository.create({
      image: image,
      createdAt: new Date(),
      profile,
    });

    await this.imageRepository.save(profilePic);

    return { message: 'user profile created successfully' };
  }

  uploadToCloudinary(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const file = cloudinary.uploader.upload_stream(
        {
          upload_preset: 'nestjs-demo',
        },
        (error, result) => {
          if (error) {
            reject(
              new Error(`Profile upload failed, ${error.message || error}`),
            );
          } else {
            resolve(result.secure_url);
          }
        },
      );
      Readable.from(buffer).pipe(file);
    });
  }
}

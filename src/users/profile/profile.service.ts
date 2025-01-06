import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../typeorm/profile';
import { Repository } from 'typeorm';
import { CreateUserProfile } from '../dtos/createProfile.dto';
import { User } from '../typeorm/user';
import { ProfilePic } from '../typeorm/profile.pic.entity';
import { CreateProfilePicDto } from '../dtos/createProfilePic.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(ProfilePic)
    private imageRepository: Repository<ProfilePic>,
  ) {}

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

    if (!profileData.image) throw new Error('Image is required');

    const profilePic = this.imageRepository.create({
      image: profileData.image,
      createdAt: new Date(),
      profile,
    });

    await this.imageRepository.save(profilePic);

    return { message: 'user profile created successfully' };
  }
}

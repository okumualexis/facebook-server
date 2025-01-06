import { IsOptional, IsString } from 'class-validator';

export class CreateProfilePicDto {
  @IsString()
  @IsOptional()
  image: string;
}

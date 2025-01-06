import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './typeorm/user';
import { Repository } from 'typeorm';
import { CreateUserDto, updateUserDto } from './dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, email, username } = createUserDto;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const UserExist = await this.userRespository.findOne({
      where: { email },
    });

    if (UserExist) {
      throw new BadRequestException('Email address is already in use!');
    }

    const newUser = this.userRespository.create({
      email,
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await this.userRespository.save(newUser);

    return {
      message: 'User created successfully',
    };
  }

  async loginUser(loginUserDto: updateUserDto) {
    const { username, password } = loginUserDto;
    const userFound = await this.userRespository.findOne({
      where: { username },
    });

    if (!userFound) {
      throw new NotFoundException('Invalid login credentials');
    }

    const passwordMatched = await bcrypt.compare(password, userFound.password);

    if (!passwordMatched) {
      throw new NotFoundException('Invalid login credentials');
    }

    return this.generateToken({ userId: userFound.id });
  }

  getUsers() {
    const users = this.userRespository.find({
      select: ['id', 'email', 'username', 'createdAt'],
      relations: ['profile', 'profile.image'],
    });
    return users;
  }

  private generateToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }
}

import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, updateUserDto } from './dtos/createUser.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Post()
  createUser(@Body(ValidationPipe) userDetails: CreateUserDto) {
    return this.userService.createUser(userDetails);
  }

  @Post('login')
  loginUser(@Body() userLogin: updateUserDto) {
    return this.userService.loginUser(userLogin);
  }
}

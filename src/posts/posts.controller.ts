import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/createpost.dto';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post(':id')
  createPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(id, createPostDto);
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }
}

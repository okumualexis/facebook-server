import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dtos/createpost.dto';
import { User } from 'src/users/typeorm/user';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createPost(id: number, createdPost: CreatePostDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const newPost = this.postRepository.create({
      user,
      ...createdPost,
    });

    await this.postRepository.save(newPost);

    return {
      message: 'Post created successfully!',
    };
  }

  async getAllPosts() {
    const allPosts = await this.postRepository.find({
      relations: ['user', 'user.profile'],
    });

    const result = allPosts.map((post) => ({
      ...post,
      user: {
        ...post.user,
        password: undefined,
        profile: (() => {
          const { id, ...rest } = post.user.profile;
          return rest;
        })(),
      },
    }));

    return result;
  }
}

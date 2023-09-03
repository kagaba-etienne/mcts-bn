import { Injectable, UseGuards } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from 'src/schemas/blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('Blog')
    private blogModel: Model<Blog>,
  ) {}

  @UseGuards(AuthGuard)
  async create(createBlogDto: CreateBlogDto) {
    try {
      const Ublog = await this.blogModel.create(createBlogDto);
      return { status: 200, message: 'Blog created succesfully!' };
    } catch (err) {
      return { status: 400, message: 'Blog was not created', error: err };
    }
  }

  async findAll() {
    const uBlogs = await this.blogModel.find().sort({createdAt: -1});
    return {
      status: 200,
      message: 'Blogs were retrieved successfully!',
      blogs: uBlogs,
    };
  }

  async findOne(id: string) {
    try {
      const uBlog = await this.blogModel.findById(id);
      return {
        status: 200,
        message: 'Blog was retrieved successfully!',
        blog: uBlog,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Blog was not retrieved!',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  async update(id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const uBlog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto);
      return { status: 200, message: 'Blog was updated successfully!' };
    } catch (error) {
      return {
        status: 400,
        message: 'Blog was not updated!',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  async remove(id: string) {
    try {
      const uBlog = await this.blogModel.findByIdAndRemove(id);
      return {
        status: 200,
        message: `Blog with title ${uBlog.title} was deleted successfully!`,
      };
    } catch (error) {
      return {
        status: 400,
        message: 'Blog was not deleted!',
        error: error.message,
      };
    }
  }
}

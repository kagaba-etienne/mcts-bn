import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from 'src/schemas/blog.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}

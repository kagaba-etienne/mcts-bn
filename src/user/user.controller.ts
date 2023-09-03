import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Patch('')
  @UseInterceptors(NoFilesInterceptor())
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req['user'].id;
    return this.userService.update(id, updateUserDto);
  }

  @Delete('')
  remove(@Request() req) {
    const id = req['user'].id;
    return this.userService.remove(id);
  }
}

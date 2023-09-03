import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const password = createUserDto.password;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const uUser = await this.userModel.create({
        ...createUserDto,
        password: hash,
      });
      return {
        status: 200,
        message: `User with email ${uUser.email} was created successfully!`,
      };
    } catch (error) {
      return { status: 400, message: 'User was not created!', error };
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find();
      return { status: 200, message: 'Users retrieved successfully!', users };
    } catch (error) {
      return { status: 400, message: 'Users were not retrieved!', error };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto)
    try {
      const saltOrRounds = 10;
      const password = updateUserDto.password;
      if (password.length > 0) {
        if(password.length < 8 || password.length > 20) {
          console.log("here")
          return { status: 400, message: "Password length must be greater than 8 characters and less than 20 characters"}
        }
        console.log(password.length < 8 || password.length > 20)
        const hash = await bcrypt.hash(password, saltOrRounds);
        updateUserDto.password = hash;
      } else {
        delete updateUserDto.password
      }
      console.log(updateUserDto)
      const uUser = await this.userModel.findByIdAndUpdate(id, { ...updateUserDto });
      return { status: 200, message: `User updated successfully!` };
    } catch (error) {
      return { status: 400, message: 'User was not updated!', error };
    }
  }

  async remove(id: string) {
    try {
      const uUser = await this.userModel.findByIdAndRemove(id);
      return { status: 200, message: `User with email ${uUser.email}` };
    } catch (error) {
      return { status: 400, message: 'User was not removed', error };
    }
  }
}

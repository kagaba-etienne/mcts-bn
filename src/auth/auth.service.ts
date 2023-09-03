import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User')
    private userModel: Model<User>,
  ) {}

  async signIn(signInDto: CreateAuthDto) {
    try {
      const uUser = await this.userModel.findOne({ email: signInDto.email });
      if (!uUser?.password) {
        return {
          status: 400,
          message:
            "Signin failed, user with provided credentials doesn't exist!",
        };
      }
      const match = await bcrypt.compare(signInDto.password, uUser.password);
      if (!match) {
        return {
          status: 401,
          message: "Unauthorized"
        }
      }
      const payload = { name: uUser.name, email: uUser.email, id: uUser._id };
      return {
        status: 200,
        message: `Welcome back ${uUser.name.split(' ')[0]} !`,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      return { status: 400, message: 'Signin failed', error: error.message };
    }
  }
}

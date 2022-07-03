import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUsers(query: PaginationDTO): Promise<UserDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.userModel
      .find(filter, project)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getUsersCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.userModel.count(filter);
  }

  async getUser(userId: string): Promise<UserDocument> {
    return this.userModel.findById(userId);
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    return this.userModel.create(createUserDto);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userModel.updateOne({ _id: userId }, updateUserDto);
  }

  async deleteUser(userId: string): Promise<any> {
    return this.userModel.deleteOne({ _id: userId });
  }
}

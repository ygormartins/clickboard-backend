import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nanoId = require('nanoid-esm');

@Injectable()
export class UsersService {
  constructor(private dbService: DatabaseService) {}

  async getUsers(query: PaginationDTO): Promise<User[]> {
    const { filter, sort, skip, limit } = buildPaginationQuery(query);

    return this.dbService.user.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: sort,
    });
  }

  async getUsersCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.dbService.user.count({ where: filter });
  }

  async getUser(userId: string): Promise<User> {
    return this.dbService.user.findUnique({
      where: { id: userId },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.dbService.user.findUnique({
      where: { email: email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.dbService.user.create({
      data: { ...createUserDto, spaceId: nanoId() },
    });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.dbService.user.update({
      where: { id: userId },
      data: updateUserDto,
    });
  }

  async deleteUser(userId: string): Promise<User> {
    return this.dbService.user.delete({ where: { id: userId } });
  }
}

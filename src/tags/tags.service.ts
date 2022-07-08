import { Injectable } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private dbService: DatabaseService) {}

  async getTags(query: PaginationDTO): Promise<Tag[]> {
    const { filter, limit, skip, sort } = buildPaginationQuery(query);

    return this.dbService.tag.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: sort,
    });
  }

  async getTagsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.dbService.tag.count({ where: filter });
  }

  async getTag(tagId: string): Promise<Tag> {
    return this.dbService.tag.findUnique({
      where: { id: tagId },
      include: { board: true, tickets: true },
    });
  }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return this.dbService.tag.create({ data: createTagDto });
  }
}

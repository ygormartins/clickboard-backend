import { Injectable } from '@nestjs/common';
import { Column } from '@prisma/client';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(private dbService: DatabaseService) {}

  async getColumns(query: PaginationDTO): Promise<Column[]> {
    const { filter, sort, skip, limit } = buildPaginationQuery(query);

    return this.dbService.column.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: sort,
    });
  }

  async getColumn(columnId: string): Promise<Column> {
    return this.dbService.column.findUnique({
      where: { id: columnId },
      include: { board: true, tickets: { include: { assignedTo: true } } },
    });
  }

  async getColumnsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.dbService.column.count({ where: filter });
  }

  async createColumn(createColumnDto: CreateColumnDto): Promise<Column> {
    return this.dbService.column.create({ data: createColumnDto });
  }

  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<Column> {
    return this.dbService.column.update({
      where: { id: columnId },
      data: updateColumnDto,
    });
  }

  async deleteColumn(columnId: string): Promise<any> {
    return this.dbService.column.delete({ where: { id: columnId } });
  }
}

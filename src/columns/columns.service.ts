import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from 'src/boards/boards.schema';
import { BoardsService } from 'src/boards/boards.service';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseModel } from 'src/database/database.model';
import { Column, ColumnDocument } from './columns.schema';
import { CreateColumnDto } from './dto/create-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name)
    private columnModel: DatabaseModel<ColumnDocument>,
    private boardsService: BoardsService,
  ) {}

  async getColumns(query: PaginationDTO): Promise<ColumnDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.columnModel
      .find(filter, project)
      .populate('board', '', Board.name)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getColumnsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.columnModel.count(filter);
  }

  async createColumn(createColumnDto: CreateColumnDto): Promise<any> {
    const newColumn = await this.columnModel.create(createColumnDto);

    return this.boardsService.addColumnToBoard(
      createColumnDto.board,
      newColumn._id,
    );
  }
}

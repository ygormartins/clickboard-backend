import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from 'src/boards/boards.schema';
import { BoardsService } from 'src/boards/boards.service';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseModel } from 'src/database/database.model';
import { Column, ColumnDocument } from './columns.schema';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name)
    private columnModel: DatabaseModel<ColumnDocument>,
    @Inject(forwardRef(() => BoardsService))
    private boardsService: BoardsService,
  ) {}

  async getColumns(query: PaginationDTO): Promise<ColumnDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.columnModel
      .find(filter, project)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getColumn(columnId: string): Promise<ColumnDocument> {
    return this.columnModel
      .findById(columnId)
      .populate('board', '', Board.name);
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

  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateColumnDto,
  ): Promise<any> {
    return this.columnModel.updateOne({ _id: columnId }, updateColumnDto);
  }

  async deleteColumn(columnId: string): Promise<any> {
    const column = await this.columnModel.findById(columnId);

    if (!column) throw new NotFoundException("Column doesn't exist");

    const board = await this.boardsService.getBoard(String(column.board));

    if (board) this.boardsService.removeColumFromBoard(board._id, column._id);

    return this.columnModel.deleteById(columnId);
  }
}

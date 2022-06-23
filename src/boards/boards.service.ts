import { Types } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { DatabaseModel } from 'src/database/database.model';
import { Board, BoardDocument } from './boards.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Column } from 'src/columns/columns.schema';
import { ColumnsService } from 'src/columns/columns.service';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name)
    private boardModel: DatabaseModel<BoardDocument>,
    @Inject(forwardRef(() => ColumnsService))
    private columnsService: ColumnsService,
  ) {}

  async getBoards(query: PaginationDTO): Promise<BoardDocument[]> {
    const { filter, project, sort, skip, limit } = buildPaginationQuery(query);

    return this.boardModel
      .find(filter, project)
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getBoardsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.boardModel.count(filter);
  }

  async addColumnToBoard(
    boardId: string,
    columnId: Types.ObjectId,
  ): Promise<BoardDocument> {
    const board = await this.boardModel.findById(boardId);

    board.columns.push(columnId);

    return board.save();
  }

  async removeColumFromBoard(
    boardId: Types.ObjectId,
    columnId: Types.ObjectId,
  ): Promise<BoardDocument> {
    const board = await this.boardModel.findById(boardId);

    board.columns = board.columns.filter(
      (column) => String(column) != String(columnId),
    );

    return board.save();
  }

  async getBoard(boardId: string): Promise<BoardDocument> {
    return this.boardModel
      .findById(boardId)
      .populate('columns', '', Column.name);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<BoardDocument> {
    return this.boardModel.create(createBoardDto);
  }

  async updateBoard(
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<any> {
    return this.boardModel.updateOne({ _id: boardId }, updateBoardDto);
  }

  async deleteBoard(boardId: string): Promise<any> {
    const board = await this.boardModel.findById(boardId);
    const boardColumns = [...board?.columns] || [];

    for (const column of boardColumns) {
      this.columnsService.deleteColumn(String(column));
    }

    return board.delete();
  }
}

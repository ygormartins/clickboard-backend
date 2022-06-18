import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/database/database.model';
import { Board, BoardDocument } from './boards.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name)
    private boardModel: DatabaseModel<BoardDocument>,
  ) {}

  async getBoards(): Promise<BoardDocument[]> {
    return this.boardModel.find();
  }

  async getBoard(boardId: string): Promise<Board> {
    return this.boardModel.findById(boardId);
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardModel.create(createBoardDto);
  }

  async updateBoard(
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<any> {
    return this.boardModel.updateOne({ _id: boardId }, updateBoardDto);
  }

  async deleteBoard(boardId: string): Promise<any> {
    return this.boardModel.deleteById(boardId);
  }
}

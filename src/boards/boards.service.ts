import { Injectable } from '@nestjs/common';
import { buildPaginationQuery } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { DatabaseService } from 'src/database/database.service';
import { Board } from '@prisma/client';
import slugify from 'slugify';

@Injectable()
export class BoardsService {
  constructor(private dbService: DatabaseService) {}

  async getBoards(query: PaginationDTO): Promise<Board[]> {
    const { filter, sort, skip, limit } = buildPaginationQuery(query);

    return this.dbService.board.findMany({
      where: filter,
      skip,
      take: limit,
      orderBy: sort,
    });
  }

  async getBoardsCount(query: PaginationDTO): Promise<number> {
    const { filter } = buildPaginationQuery(query);

    return this.dbService.board.count({ where: filter });
  }

  async getBoard(boardId: string): Promise<Board> {
    return this.dbService.board.findUnique({
      where: { id: boardId },
      include: { columns: true },
    });
  }

  async getBoardBySlug(space: string, slug: string): Promise<Board> {
    return this.dbService.board.findFirst({
      where: { slug },
      include: { columns: true },
    });
  }

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.dbService.board.create({
      data: {
        ...createBoardDto,
        slug: slugify(createBoardDto.name, { lower: true }),
      },
    });
  }

  async updateBoard(
    boardId: string,
    updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return this.dbService.board.update({
      data: updateBoardDto,
      where: { id: boardId },
    });
  }

  async deleteBoard(boardId: string): Promise<Board> {
    return this.dbService.board.delete({
      where: { id: boardId },
    });
  }
}

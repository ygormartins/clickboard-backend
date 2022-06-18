import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll() {
    return this.boardsService.getBoards();
  }

  @Get(':id')
  findOne(@Param('id') boardId: string) {
    return this.boardsService.getBoard(boardId);
  }

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(createBoardDto);
  }

  @Put(':id')
  update(@Param('id') boardId: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.updateBoard(boardId, updateBoardDto);
  }

  @Delete(':id')
  delete(@Param('id') boardId: string) {
    return this.boardsService.deleteBoard(boardId);
  }
}

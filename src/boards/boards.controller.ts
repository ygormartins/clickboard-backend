import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { strategies } from 'src/auth/strategies';
import { paginated } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@UseGuards(AuthGuard(strategies.JWT))
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@Query() query: PaginationDTO) {
    return paginated(
      query,
      (args: PaginationDTO) => this.boardsService.getBoards(args),
      (args: PaginationDTO) => this.boardsService.getBoardsCount(args),
    );
  }

  @Get(':id')
  findOne(@Param('id') boardId: string) {
    return this.boardsService.getBoard(boardId);
  }

  @Get(':space/:slug')
  findOneBySlug(@Param('space') space: string, @Param('slug') slug: string) {
    return this.boardsService.getBoardBySlug(space, slug);
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

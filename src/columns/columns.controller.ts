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
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@UseGuards(AuthGuard(strategies.JWT))
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  findAll(@Query() query: PaginationDTO) {
    return paginated(
      query,
      (args: PaginationDTO) => this.columnsService.getColumns(args),
      (args: PaginationDTO) => this.columnsService.getColumnsCount(args),
    );
  }

  @Get(':id')
  findOne(@Param('id') columnId: string) {
    return this.columnsService.getColumn(columnId);
  }

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.createColumn(createColumnDto);
  }

  @Put(':id')
  update(
    @Param('id') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.columnsService.updateColumn(columnId, updateColumnDto);
  }

  @Delete(':id')
  delete(@Param('id') columnId: string) {
    return this.columnsService.deleteColumn(columnId);
  }
}

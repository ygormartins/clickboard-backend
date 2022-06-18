import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { paginated } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';

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

  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.createColumn(createColumnDto);
  }
}

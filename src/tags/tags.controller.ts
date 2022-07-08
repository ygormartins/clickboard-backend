import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { strategies } from 'src/auth/strategies';
import { paginated } from 'src/common/pagination/pagination';
import { PaginationDTO } from 'src/common/pagination/pagination.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

@UseGuards(AuthGuard(strategies.JWT))
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@Query() query: PaginationDTO) {
    return paginated(
      query,
      (args: PaginationDTO) => this.tagsService.getTags(args),
      (args: PaginationDTO) => this.tagsService.getTagsCount(args),
    );
  }

  @Get(':id')
  findOne(@Param('id') tagId: string) {
    return this.tagsService.getTag(tagId);
  }

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(createTagDto);
  }
}

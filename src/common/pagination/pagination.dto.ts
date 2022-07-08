import { IsBoolean, IsInt, IsObject, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export class PaginationDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = DEFAULT_LIMIT;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = DEFAULT_PAGE;

  @Transform(({ value }) => JSON.parse(value || '{}'))
  @IsObject()
  @IsOptional()
  sort?: any = {};

  @Transform(({ value }) => JSON.parse(value || '{}'))
  @IsObject()
  @IsOptional()
  filter?: any = {};

  @Transform(({ value }: { value: string }) => value.toLowerCase() === 'true')
  @IsBoolean()
  @IsOptional()
  paginated? = true;
}

export class PaginatedQuery {
  filter: any;
  sort: any;
  skip: number;
  limit: number;
}

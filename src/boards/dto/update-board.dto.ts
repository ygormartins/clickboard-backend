import { IsString, IsOptional } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

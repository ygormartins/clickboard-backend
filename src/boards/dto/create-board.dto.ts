import { IsString, IsOptional } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

import { IsString, IsOptional } from 'class-validator';

export class CreateTagDto {
  @IsString()
  readonly label: string;

  @IsString()
  readonly boardId: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}

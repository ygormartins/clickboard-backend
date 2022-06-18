import { IsString, IsOptional } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  readonly label: string;

  @IsString()
  readonly board: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}

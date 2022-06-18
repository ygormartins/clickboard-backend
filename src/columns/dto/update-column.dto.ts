import { IsString, IsOptional } from 'class-validator';

export class UpdateColumnDto {
  @IsOptional()
  @IsString()
  readonly label?: string;

  @IsOptional()
  @IsString()
  readonly board?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}

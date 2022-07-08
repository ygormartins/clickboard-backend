import { IsString, IsOptional } from 'class-validator';

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  readonly label?: string;

  @IsOptional()
  @IsString()
  readonly color?: string;
}

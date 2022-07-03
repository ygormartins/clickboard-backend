import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly assignedTo?: string[];
}

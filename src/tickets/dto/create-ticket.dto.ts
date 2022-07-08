import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly columnId: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly assignedTo?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly tags?: string[];

  @IsOptional()
  @IsString()
  readonly description?: string;
}

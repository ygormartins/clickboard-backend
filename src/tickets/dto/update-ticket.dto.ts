import { IsString, IsOptional } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

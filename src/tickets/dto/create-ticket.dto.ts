import { IsString, IsOptional } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly column: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}

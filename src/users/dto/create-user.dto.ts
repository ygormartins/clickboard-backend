import { IsString, IsOptional, IsEmail, IsBase64 } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  readonly password: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsBase64()
  readonly avatar?: string;
}

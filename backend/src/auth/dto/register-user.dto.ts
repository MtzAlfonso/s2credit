import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

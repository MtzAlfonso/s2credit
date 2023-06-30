import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsNumber()
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  updated?: boolean;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}

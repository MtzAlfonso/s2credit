import { IsString, IsUUID } from 'class-validator';

export class RestoreTodoDto {
  @IsString()
  @IsUUID()
  historyId: string;
}

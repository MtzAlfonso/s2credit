import { IUser } from './user.interface';

export interface IRevalidateTokenResponse {
  user: IUser;
  token: string;
}

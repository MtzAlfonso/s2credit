import { User } from '@prisma/client';

export interface ILoginResponse {
  user: Partial<User>;
  token: string;
}

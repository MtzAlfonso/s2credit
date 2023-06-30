import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (roles: Role[] = [], context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request['user'] as Omit<User, 'password'>;

    if (!user) throw new InternalServerErrorException('No user inside request');

    if (!roles.length) return user;

    const hasRole = () => roles.some((role) => user.roles.includes(role));

    if (user && hasRole()) return user;

    throw new ForbiddenException(
      `You do not have permission (Roles: ${roles})`,
    );
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Injecte l'utilisateur courant depuis le JWT.
 * Usage: @CurrentUser() user: User
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

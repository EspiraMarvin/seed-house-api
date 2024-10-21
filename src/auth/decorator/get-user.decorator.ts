import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// get specific field from user with user[data] else return all user infor
export const GetUserData = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      // delete request['user'].password;
      return request['user'][data];
    }
    return request['user'];
  },
);

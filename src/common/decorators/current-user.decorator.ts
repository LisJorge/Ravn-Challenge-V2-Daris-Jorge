import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Exception } from 'handlebars';
import { CurrentUserDto } from '../dto/current-user.dto';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserDto;
    if(!user){
      throw new Exception('Invalid information');
    }
    return data? user[data]: user;
  },
);

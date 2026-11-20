import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, PublicUser } from './auth.service';
export type UserRequest=Request&{user:PublicUser};
@Injectable() export class SessionGuard implements CanActivate {
 constructor(private readonly auth:AuthService){}
 async canActivate(context:ExecutionContext){const request=context.switchToHttp().getRequest<UserRequest>();request.user=await this.auth.authenticate(request.cookies?.mare_session);return true;}
}

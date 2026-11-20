import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request,Response } from 'express';
import { AuthService } from './auth.service';
import { CredentialsDto } from './auth.dto';
import { SessionGuard,UserRequest } from './session.guard';
import { env } from '../common/env';
@ApiTags('auth') @Controller('auth') export class AuthController {
 constructor(private readonly auth:AuthService){}
 private cookie(res:Response,result:{token:string;expiresAt:Date}){res.cookie('mare_session',result.token,{httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'strict',path:'/',expires:result.expiresAt});}
 @Post('register') @Throttle({default:{limit:5,ttl:60000}}) async register(@Body()dto:CredentialsDto,@Res({passthrough:true})res:Response){const result=await this.auth.register(dto.email,dto.password);this.cookie(res,result);return {user:result.user};}
 @Post('login') @HttpCode(200) @Throttle({default:{limit:8,ttl:60000}}) async login(@Body()dto:CredentialsDto,@Res({passthrough:true})res:Response){const result=await this.auth.login(dto.email,dto.password);this.cookie(res,result);return {user:result.user};}
 @Post('logout') @HttpCode(204) async logout(@Req()req:Request,@Res({passthrough:true})res:Response){await this.auth.logout(req.cookies?.mare_session);res.clearCookie('mare_session',{httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'strict',path:'/'});}
 @Get('me') @UseGuards(SessionGuard) @ApiCookieAuth() me(@Req()req:UserRequest){return {user:req.user};}
}

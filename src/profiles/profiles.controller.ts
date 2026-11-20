import { Body,Controller,Delete,Get,HttpCode,Param,Post,Put,Req,UseGuards } from '@nestjs/common';
import { ApiCookieAuth,ApiProperty,ApiTags } from '@nestjs/swagger';
import { IsString,Matches,MaxLength } from 'class-validator';
import { SessionGuard,UserRequest } from '../auth/session.guard';
import { PreferencesDto } from './profile.dto';
import { ProfilesService } from './profiles.service';
export class SaveSessionDto{
 @ApiProperty({example:'arrifana'})@IsString()@MaxLength(40)spotId:string;
 @ApiProperty({example:'2026-11-15T08:00',description:'Local civil time in Europe/Lisbon, exactly as returned by recommendations'})@Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:00$/)startTime:string;
}
@ApiTags('my-account')@ApiCookieAuth()@UseGuards(SessionGuard)@Controller('me')export class ProfilesController{
 constructor(private readonly profiles:ProfilesService){}
 @Get('profile')get(@Req()req:UserRequest){return this.profiles.get(req.user.id)}
 @Put('profile')put(@Req()req:UserRequest,@Body()dto:PreferencesDto){return this.profiles.put(req.user.id,dto)}
 @Get('favorites')favorites(@Req()req:UserRequest){return this.profiles.listFavorites(req.user.id)}
 @Put('favorites/:spotId')@HttpCode(204)favorite(@Req()req:UserRequest,@Param('spotId')spotId:string){return this.profiles.favorite(req.user.id,spotId)}
 @Delete('favorites/:spotId')@HttpCode(204)unfavorite(@Req()req:UserRequest,@Param('spotId')spotId:string){return this.profiles.unfavorite(req.user.id,spotId)}
 @Get('sessions')sessions(@Req()req:UserRequest){return this.profiles.listSessions(req.user.id)}
 @Post('sessions')session(@Req()req:UserRequest,@Body()dto:SaveSessionDto){return this.profiles.saveSession(req.user.id,dto.spotId,dto.startTime)}
 @Delete('sessions/:id')@HttpCode(204)remove(@Req()req:UserRequest,@Param('id')id:string){return this.profiles.removeSession(req.user.id,id)}
}

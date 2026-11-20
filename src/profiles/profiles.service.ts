import { BadRequestException,Injectable,NotFoundException,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { ProfileEntity,FavoriteEntity,SavedSessionEntity,SurfProfile } from '../database/entities';
import { PreferencesDto } from './profile.dto';
import { SpotsService } from '../spots/spots.service';
import { RecommendationsService } from '../recommendations/recommendations.service';
@Injectable()export class ProfilesService{
 constructor(@InjectRepository(ProfileEntity)private readonly profiles:Repository<ProfileEntity>,@InjectRepository(FavoriteEntity)private readonly favorites:Repository<FavoriteEntity>,@InjectRepository(SavedSessionEntity)private readonly sessions:Repository<SavedSessionEntity>,private readonly spots:SpotsService,private readonly recommendations:RecommendationsService){}
 async get(userId:string){const p=await this.profiles.findOneBy({userId});if(!p)throw new NotFoundException('PROFILE_NOT_FOUND');return {settings:p.settings,language:p.language,watchEnabled:p.watchEnabled,alertThreshold:p.alertThreshold,alertDelivery:'in-page-only'};}
 async put(userId:string,dto:PreferencesDto){if(dto.min>=dto.max)throw new BadRequestException('INVALID_WAVE_RANGE');const existing=await this.get(userId);const settings:SurfProfile={level:dto.level,availability:dto.availability,scope:dto.scope,min:dto.min,max:dto.max,wind:dto.wind};await this.profiles.update({userId},{settings,language:dto.language??existing.language,watchEnabled:dto.watchEnabled??existing.watchEnabled,alertThreshold:dto.alertThreshold??existing.alertThreshold});return this.get(userId);}
 async listFavorites(userId:string){return {spotIds:(await this.favorites.findBy({userId})).map(f=>f.spotId)};}
 async favorite(userId:string,spotId:string){this.spots.get(spotId);await this.favorites.upsert({userId,spotId},['userId','spotId']);}
 async unfavorite(userId:string,spotId:string){this.spots.get(spotId);await this.favorites.delete({userId,spotId});}
 listSessions(userId:string){return this.sessions.find({where:{userId},order:{createdAt:'DESC'},take:20});}
 async saveSession(userId:string,spotId:string,startTime:string){
  this.spots.get(spotId);const existing=await this.sessions.findOneBy({userId,spotId,startTime});if(existing)return existing;
  const profile=await this.get(userId),favorites=await this.listFavorites(userId),result=await this.recommendations.get(profile.settings,favorites.spotIds);
  const candidate=result.candidates.find(c=>c.spotId===spotId&&c.key===startTime);if(!candidate||profile.settings.scope==='favorites'&&!favorites.spotIds.includes(spotId))throw new BadRequestException('SESSION_NOT_AVAILABLE_FOR_PROFILE');
  if(await this.sessions.countBy({userId})>=20)throw new ConflictException('SAVED_SESSION_LIMIT');
  const c=candidate,snapshot={name:this.spots.get(spotId).name,date:c.date,hour:c.hour,score:c.score,minHeight:c.minHeight,maxHeight:c.maxHeight,maxWind:c.maxWind,period:c.period,forecastFetchedAt:result.forecastFetchedAt,stale:result.stale,method:result.method};
  try{return await this.sessions.save({id:randomUUID(),userId,spotId,startTime,snapshot})}catch(error){const saved=await this.sessions.findOneBy({userId,spotId,startTime});if(saved)return saved;throw error;}
 }
 async removeSession(userId:string,id:string){const result=await this.sessions.delete({id,userId});if(!result.affected)throw new NotFoundException('SAVED_SESSION_NOT_FOUND');}
}

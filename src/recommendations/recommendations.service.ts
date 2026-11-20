import { Injectable,BadRequestException } from '@nestjs/common';
import { ForecastService } from '../forecast/forecast.service';
import { SpotsService } from '../spots/spots.service';
import { SurfProfile } from '../database/entities';
import { generateCandidates,pickSessions } from './engine';
@Injectable()export class RecommendationsService{
 constructor(private readonly forecasts:ForecastService,private readonly spots:SpotsService){}
 async get(profile:SurfProfile,favoriteIds:string[]=[]){if(profile.min>=profile.max)throw new BadRequestException('INVALID_WAVE_RANGE');const forecast=await this.forecasts.get(),candidates=generateCandidates(forecast,this.spots.spots,profile);const scoped=candidates.filter(c=>profile.scope!=='favorites'||favoriteIds.includes(c.spotId));return {candidates,suggested:pickSessions(scoped),generatedAt:new Date().toISOString(),forecastFetchedAt:forecast.fetchedAt,stale:forecast.stale,timezone:forecast.timezone,method:'rules-v1',localQualityValidated:false};}
}

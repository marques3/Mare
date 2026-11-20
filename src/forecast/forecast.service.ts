import { Injectable,Logger,ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForecastCacheEntity } from '../database/entities';
import { ForecastProvider } from './forecast.provider';
import { ForecastPayload,ForecastResponse,forecastPayloadSchema } from './forecast.types';
import { env } from '../common/env';
export const FRESH_TTL_MS=30*60*1000,MAX_STALE_MS=3*60*60*1000;
@Injectable()export class ForecastService {
 private readonly logger=new Logger(ForecastService.name);
 private cache?:{payload:ForecastPayload;fetchedAt:Date};private pending?:Promise<ForecastResponse>;
 constructor(@InjectRepository(ForecastCacheEntity)private readonly rows:Repository<ForecastCacheEntity>,private readonly provider:ForecastProvider){}
 private response(stale:boolean):ForecastResponse{return {...this.cache!.payload,fetchedAt:this.cache!.fetchedAt.toISOString(),stale,timezone:'Europe/Lisbon',attribution:'Open-Meteo — automatically selected weather and marine models',accessMode:env.OPEN_METEO_API_KEY?'commercial':'prototype'}}
 async get():Promise<ForecastResponse>{if(this.cache&&Date.now()-this.cache.fetchedAt.getTime()<FRESH_TTL_MS)return this.response(false);if(this.pending)return this.pending;this.pending=this.resolve();try{return await this.pending}finally{this.pending=undefined}}
 private async resolve():Promise<ForecastResponse>{
  if(!this.cache){const row=await this.rows.findOneBy({id:'latest-v1'});if(row){const parsed=forecastPayloadSchema.safeParse(row.payload);if(parsed.success)this.cache={payload:parsed.data,fetchedAt:row.fetchedAt};}if(this.cache&&Date.now()-this.cache.fetchedAt.getTime()<FRESH_TTL_MS)return this.response(false);}
  try{const payload=await this.provider.fetch(),fetchedAt=new Date();await this.rows.upsert({id:'latest-v1',payload,fetchedAt},['id']);this.cache={payload,fetchedAt};return this.response(false)}
  catch {this.logger.warn('Forecast refresh failed; checking bounded stale cache');if(this.cache&&Date.now()-this.cache.fetchedAt.getTime()<=MAX_STALE_MS)return this.response(true);throw new ServiceUnavailableException('FORECAST_UNAVAILABLE');}
 }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForecastCacheEntity } from '../database/entities';
import { SpotsModule } from '../spots/spots.module';
import { ForecastProvider } from './forecast.provider';
import { ForecastService } from './forecast.service';
import { ForecastController } from './forecast.controller';
@Module({imports:[SpotsModule,TypeOrmModule.forFeature([ForecastCacheEntity])],providers:[ForecastProvider,ForecastService],controllers:[ForecastController],exports:[ForecastService]})export class ForecastModule{}

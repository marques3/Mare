import { Module } from '@nestjs/common';
import { ForecastModule } from '../forecast/forecast.module';
import { SpotsModule } from '../spots/spots.module';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
@Module({imports:[ForecastModule,SpotsModule],providers:[RecommendationsService],controllers:[RecommendationsController],exports:[RecommendationsService]})export class RecommendationsModule{}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard,ThrottlerModule } from '@nestjs/throttler';
import { databaseOptions } from './database/options';
import { AuthModule } from './auth/auth.module';
import { SpotsModule } from './spots/spots.module';
import { ForecastModule } from './forecast/forecast.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { ProfilesModule } from './profiles/profiles.module';
import { HealthController } from './health/health.controller';
@Module({imports:[TypeOrmModule.forRoot({...databaseOptions,retryAttempts:3,retryDelay:1000}),ThrottlerModule.forRoot([{name:'default',ttl:60000,limit:120}]),AuthModule,SpotsModule,ForecastModule,RecommendationsModule,ProfilesModule],controllers:[HealthController],providers:[{provide:APP_GUARD,useClass:ThrottlerGuard}]})export class AppModule{}

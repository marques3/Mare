import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity,FavoriteEntity,SavedSessionEntity } from '../database/entities';
import { AuthModule } from '../auth/auth.module';
import { SpotsModule } from '../spots/spots.module';
import { RecommendationsModule } from '../recommendations/recommendations.module';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
@Module({imports:[AuthModule,SpotsModule,RecommendationsModule,TypeOrmModule.forFeature([ProfileEntity,FavoriteEntity,SavedSessionEntity])],providers:[ProfilesService],controllers:[ProfilesController]})export class ProfilesModule{}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity,AuthSessionEntity } from '../database/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { SessionGuard } from './session.guard';
@Module({imports:[TypeOrmModule.forFeature([UserEntity,AuthSessionEntity])],controllers:[AuthController],providers:[AuthService,PasswordService,SessionGuard],exports:[AuthService,SessionGuard]})export class AuthModule{}

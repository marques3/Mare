import { Controller,Get,ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('health')@Controller('health')export class HealthController{
 constructor(private readonly db:DataSource){}
 @Get()live(){return {status:'ok',service:'mare-api'}}
 @Get('ready')async ready(){try{await this.db.query('SELECT id FROM users LIMIT 1');return {status:'ok',database:'ready'}}catch{throw new ServiceUnavailableException('DATABASE_NOT_READY')}}
}

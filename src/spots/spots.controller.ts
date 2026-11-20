import { Controller,Get,Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SpotsService } from './spots.service';
@ApiTags('spots')@Controller('spots')export class SpotsController{constructor(private readonly spots:SpotsService){}@Get()list(){return this.spots.list()}@Get(':id')get(@Param('id')id:string){return this.spots.get(id)}}

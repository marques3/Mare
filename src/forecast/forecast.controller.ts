import { Controller,Get,Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForecastService } from './forecast.service';
@ApiTags('forecast')@Controller('forecast')export class ForecastController{constructor(private readonly forecasts:ForecastService){}@Get()@Header('Cache-Control','no-store')get(){return this.forecasts.get()}}

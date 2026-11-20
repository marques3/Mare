import { Body,Controller,Post,HttpCode,Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecommendationDto } from '../profiles/profile.dto';
import { RecommendationsService } from './recommendations.service';
@ApiTags('recommendations')@Controller('recommendations')export class RecommendationsController{constructor(private readonly recommendations:RecommendationsService){}@Post()@HttpCode(200)@Header('Cache-Control','no-store')get(@Body()dto:RecommendationDto){return this.recommendations.get(dto,dto.favoriteIds)}}

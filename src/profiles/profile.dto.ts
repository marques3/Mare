import { IsArray,IsBoolean,IsIn,IsNumber,IsOptional,Max,Min,ArrayMaxSize,IsInt } from 'class-validator';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { SurfProfile } from '../database/entities';
import catalog from '../spots/spots.json';
export class ProfileDto implements SurfProfile {
 @ApiProperty({enum:['beginner','intermediate','advanced']})@IsIn(['beginner','intermediate','advanced']) level:SurfProfile['level'];
 @ApiProperty({enum:['all','morning','afternoon']})@IsIn(['all','morning','afternoon']) availability:SurfProfile['availability'];
 @ApiProperty({enum:['all','favorites']})@IsIn(['all','favorites'])scope:SurfProfile['scope'];
 @ApiProperty({minimum:.1,maximum:8})@IsNumber({maxDecimalPlaces:1})@Min(.1)@Max(8) min:number;
 @ApiProperty({minimum:.1,maximum:8})@IsNumber({maxDecimalPlaces:1})@Min(.1)@Max(8) max:number;
 @ApiProperty({minimum:1,maximum:60})@IsNumber()@Min(1)@Max(60)wind:number;
}
export class PreferencesDto extends ProfileDto {
 @ApiPropertyOptional({enum:['pt','en']})@IsOptional()@IsIn(['pt','en'])language?:'pt'|'en';
 @ApiPropertyOptional()@IsOptional()@IsBoolean()watchEnabled?:boolean;
 @ApiPropertyOptional({enum:[65,75,85]})@IsOptional()@IsInt()@IsIn([65,75,85])alertThreshold?:number;
}
export class RecommendationDto extends ProfileDto {
 @ApiPropertyOptional({type:[String],example:['arrifana']})@IsOptional()@IsArray()@ArrayMaxSize(11)@IsIn(catalog.map(s=>s.id),{each:true})favoriteIds?:string[];
}

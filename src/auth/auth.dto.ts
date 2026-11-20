import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CredentialsDto {
 @ApiProperty({example:'surfer@example.com'}) @Transform(({value})=>typeof value==='string'?value.trim().toLowerCase():value) @IsEmail() @MaxLength(254) email:string;
 @ApiProperty({minLength:12,maxLength:128}) @IsString() @MinLength(12) @MaxLength(128) password:string;
}

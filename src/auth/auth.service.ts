import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryFailedError, LessThan } from 'typeorm';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { UserEntity, AuthSessionEntity, ProfileEntity, DEFAULT_PROFILE } from '../database/entities';
import { PasswordService } from './password.service';
export const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
const dummyHash='scrypt$00000000000000000000000000000000$'+'00'.repeat(64);
export interface PublicUser { id:string;email:string;createdAt:Date; }
export const publicUser=(u:UserEntity):PublicUser=>({id:u.id,email:u.email,createdAt:u.createdAt});
@Injectable() export class AuthService {
 constructor(@InjectRepository(UserEntity) private readonly users:Repository<UserEntity>,@InjectRepository(AuthSessionEntity) private readonly sessions:Repository<AuthSessionEntity>,private readonly db:DataSource,private readonly passwords:PasswordService){}
 async register(email:string,password:string) {
  const passwordHash=await this.passwords.hash(password);let user:UserEntity;
  try {user=await this.db.transaction(async manager=>{const u=await manager.save(UserEntity,manager.create(UserEntity,{id:randomUUID(),email,passwordHash}));await manager.save(ProfileEntity,{userId:u.id,settings:{...DEFAULT_PROFILE},language:'pt',watchEnabled:false,alertThreshold:75});return u;});}
  catch(error){if(error instanceof QueryFailedError&&(error.driverError as {code?:string}).code==='ER_DUP_ENTRY')throw new ConflictException('EMAIL_ALREADY_REGISTERED');throw error;}
  return this.createSession(user);
 }
 async login(email:string,password:string) {
  const user=await this.users.findOne({where:{email},select:{id:true,email:true,createdAt:true,passwordHash:true}});
  const valid=await this.passwords.verify(password,user?.passwordHash??dummyHash);
  if(!user||!valid)throw new UnauthorizedException('INVALID_CREDENTIALS');
  return this.createSession(user);
 }
 private async createSession(user:UserEntity){const token=randomBytes(32).toString('base64url'),expiresAt=new Date(Date.now()+7*24*60*60*1000);await this.sessions.delete({expiresAt:LessThan(new Date())});await this.sessions.save({tokenHash:hashToken(token),userId:user.id,expiresAt});return {token,expiresAt,user:publicUser(user)};}
 async authenticate(token:unknown):Promise<PublicUser>{if(typeof token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(token))throw new UnauthorizedException();const session=await this.sessions.findOneBy({tokenHash:hashToken(token)});if(!session||session.expiresAt.getTime()<=Date.now())throw new UnauthorizedException();const user=await this.users.findOneBy({id:session.userId});if(!user)throw new UnauthorizedException();return publicUser(user);}
 async logout(token:unknown){if(typeof token==='string')await this.sessions.delete({tokenHash:hashToken(token)});}
}

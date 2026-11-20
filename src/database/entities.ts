import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export interface SurfProfile { level: Level; availability: 'all'|'morning'|'afternoon'; scope: 'all'|'favorites'; min: number; max: number; wind: number; }
export const DEFAULT_PROFILE: SurfProfile = {level:'intermediate',availability:'all',scope:'all',min:0.7,max:2,wind:22};
@Entity('users') export class UserEntity {
  @PrimaryColumn({type:'varchar',length:36}) id: string;
  @Index({unique:true}) @Column({type:'varchar',length:254}) email: string;
  @Column({type:'varchar',length:255,select:false}) passwordHash: string;
  @CreateDateColumn({type:'datetime',precision:3}) createdAt: Date;
}
@Entity('auth_sessions') export class AuthSessionEntity {
  @PrimaryColumn({type:'char',length:64}) tokenHash: string;
  @Index() @Column({type:'varchar',length:36}) userId: string;
  @Index() @Column({type:'datetime',precision:3}) expiresAt: Date;
  @CreateDateColumn({type:'datetime',precision:3}) createdAt: Date;
}
@Entity('profiles') export class ProfileEntity {
  @PrimaryColumn({type:'varchar',length:36}) userId: string;
  @Column({type:'json'}) settings: SurfProfile;
  @Column({type:'varchar',length:2,default:'pt'}) language: 'pt'|'en';
  @Column({type:'boolean',default:false}) watchEnabled: boolean;
  @Column({type:'int',default:75}) alertThreshold: number;
}
@Entity('favorites') export class FavoriteEntity {
  @PrimaryColumn({type:'varchar',length:36}) userId: string;
  @PrimaryColumn({type:'varchar',length:40}) spotId: string;
}
export interface SessionSnapshot { name:string; date:string; hour:number; score:number; minHeight:number; maxHeight:number; maxWind:number; period:number; }
@Entity('saved_sessions') @Index(['userId','spotId','startTime'],{unique:true}) export class SavedSessionEntity {
  @PrimaryColumn({type:'varchar',length:36}) id: string;
  @Column({type:'varchar',length:36}) userId: string;
  @Column({type:'varchar',length:40}) spotId: string;
  @Column({type:'varchar',length:16}) startTime: string;
  @Column({type:'json'}) snapshot: SessionSnapshot;
  @CreateDateColumn({type:'datetime',precision:3}) createdAt: Date;
}
@Entity('forecast_cache') export class ForecastCacheEntity {
  @PrimaryColumn({type:'varchar',length:32}) id: string;
  @Column({type:'datetime',precision:3}) fetchedAt: Date;
  @Column({type:'json'}) payload: unknown;
}
export const entities = [UserEntity,AuthSessionEntity,ProfileEntity,FavoriteEntity,SavedSessionEntity,ForecastCacheEntity];

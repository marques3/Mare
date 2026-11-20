import { DataSourceOptions } from 'typeorm';
import { readFileSync } from 'node:fs';
import { env } from '../common/env';
import { entities } from './entities';
export const databaseOptions: DataSourceOptions = {
 type:'mysql',host:env.MYSQL_HOST,port:env.MYSQL_PORT,username:env.MYSQL_USER,password:env.MYSQL_PASSWORD,database:env.MYSQL_DATABASE,
 charset:'utf8mb4',timezone:'Z',entities,synchronize:false,migrationsRun:false,logging:false,
 migrations:[__dirname+'/migrations/*{.ts,.js}'],
 ssl:env.MYSQL_SSL_CA_FILE?{ca:readFileSync(env.MYSQL_SSL_CA_FILE,'utf8'),rejectUnauthorized:true}:undefined,
 extra:{connectionLimit:10},
};

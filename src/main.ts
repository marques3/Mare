import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
import { resolve } from 'node:path';
import { AppModule } from './app.module';
import { configureHttp } from './common/http';
import { env } from './common/env';
export async function bootstrap(){
 const app=await NestFactory.create<NestExpressApplication>(AppModule,{bodyParser:false});
 const express=await import('express');app.use(express.json({limit:'32kb',strict:true}));configureHttp(app);
 app.useStaticAssets(resolve(__dirname,'../public'),{index:'index.html',maxAge:env.NODE_ENV==='production'?'1h':0});
 if(env.ENABLE_DOCS){const config=new DocumentBuilder().setTitle('MARÉ API').setDescription('Foundation: accounts, profiles, forecast cache and explainable session suggestions. No billing, email delivery or trained AI yet.').setVersion('0.1.0').addCookieAuth('mare_session').build();SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,config));}
 app.enableShutdownHooks();await app.listen(env.PORT,'0.0.0.0');return app;
}
if(require.main===module)void bootstrap();

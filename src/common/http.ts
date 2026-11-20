import { ArgumentsHost,Catch,ExceptionFilter,HttpException,Logger,ValidationPipe,INestApplication } from '@nestjs/common';
import { Response,Request } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { env } from './env';
@Catch()export class ApiErrorFilter implements ExceptionFilter{
 private readonly logger=new Logger('ApiError');
 catch(error:unknown,host:ArgumentsHost){const res=host.switchToHttp().getResponse<Response>();const parseError=error as {type?:string};const status=error instanceof HttpException?error.getStatus():parseError?.type==='entity.parse.failed'?400:parseError?.type==='entity.too.large'?413:500;const body=error instanceof HttpException?error.getResponse():{message:status===400?'INVALID_JSON':status===413?'PAYLOAD_TOO_LARGE':'INTERNAL_SERVER_ERROR'};if(status>=500)this.logger.error(error instanceof Error?error.name:'Unknown error');res.status(status).json({statusCode:status,...(typeof body==='string'?{message:body}:body as object)});}
}
export function configureHttp(app:INestApplication){
 app.setGlobalPrefix('api');app.useGlobalPipes(new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true}));app.useGlobalFilters(new ApiErrorFilter());
 app.use(cookieParser());
 app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'",'https://fonts.googleapis.com'],fontSrc:["'self'",'https://fonts.gstatic.com'],imgSrc:["'self'",'data:'],connectSrc:["'self'"],upgradeInsecureRequests:env.NODE_ENV==='production'?[]:null}}}));
 app.use((req:Request,res:Response,next:()=>void)=>{if(req.path.startsWith('/api'))res.setHeader('Cache-Control','no-store');if(!['GET','HEAD','OPTIONS'].includes(req.method)){const origin=req.headers.origin;if(origin&&origin!==env.APP_ORIGIN||!origin&&req.cookies?.mare_session){res.status(403).json({statusCode:403,message:'UNTRUSTED_ORIGIN'});return}}next();});
}

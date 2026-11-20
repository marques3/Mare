import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
const derive = (password:string,salt:string) => new Promise<Buffer>((resolve,reject)=>scrypt(password,salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024},(error,key)=>error?reject(error):resolve(key)));
@Injectable() export class PasswordService {
 async hash(password:string):Promise<string> {const salt=randomBytes(16).toString('hex');return 'scrypt$'+salt+'$'+(await derive(password,salt)).toString('hex');}
 async verify(password:string,encoded:string):Promise<boolean> {const [kind,salt,hash]=encoded.split('$');if(kind!=='scrypt'||!salt||!hash||!/^[a-f0-9]{128}$/.test(hash))return false;const actual=await derive(password,salt);return timingSafeEqual(actual,Buffer.from(hash,'hex'));}
}

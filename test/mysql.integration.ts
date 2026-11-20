import 'reflect-metadata';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureHttp } from '../src/common/http';
import { ForecastProvider } from '../src/forecast/forecast.provider';
import { fixture } from './fixture';
import { env } from '../src/common/env';
import { ForecastPayload } from '../src/forecast/forecast.types';
// No live API dependencies in integration tests. The fixture clock is shifted to today's Lisbon date.
function liveFixture():ForecastPayload{const f=fixture();const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const delta=Math.round((Date.parse(today+'T12:00:00Z')-Date.parse('2026-11-12T12:00:00Z'))/86400000);const shift=(s:string)=>{const d=new Date(s.slice(0,10)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+delta);return d.toISOString().slice(0,10)+s.slice(10)};for(const e of f.data){e.marine.time=e.marine.time.map(shift);e.weather.time=e.weather.time.map(shift);e.daylight.time=e.daylight.time.map(shift);e.daylight.sunrise=e.daylight.sunrise.map(s=>s&&shift(s));e.daylight.sunset=e.daylight.sunset.map(s=>s&&shift(s));}return f;}
test('MySQL integration: migrations, two isolated accounts, persistent profile, favorites, sessions and logout',{skip:process.env.MYSQL_INTEGRATION!=='1',timeout:60000},async()=>{
 const module=await Test.createTestingModule({imports:[AppModule]}).overrideProvider(ForecastProvider).useValue({fetch:async()=>liveFixture()}).compile();const app=module.createNestApplication();configureHttp(app);await app.init();const server=app.getHttpServer(),alice=request.agent(server),bob=request.agent(server),stamp=Date.now();const email='alice.'+stamp+'@example.com',password='example-test-password-123';
 try{
  await request(server).get('/api/health/ready').expect(200);
  const register=await alice.post('/api/auth/register').set('Origin',env.APP_ORIGIN).send({email,password}).expect(201);assert.ok(register.headers['set-cookie'][0].includes('HttpOnly'));assert.equal(register.body.user.passwordHash,undefined);
  await bob.post('/api/auth/register').set('Origin',env.APP_ORIGIN).send({email:'bob.'+stamp+'@example.com',password}).expect(201);
  await alice.put('/api/me/profile').set('Origin',env.APP_ORIGIN).send({level:'advanced',availability:'all',scope:'all',min:.5,max:3,wind:25,language:'en'}).expect(200);
  assert.equal((await alice.get('/api/me/profile').expect(200)).body.settings.level,'advanced');assert.equal((await bob.get('/api/me/profile').expect(200)).body.settings.level,'intermediate');
  await alice.put('/api/me/favorites/arrifana').set('Origin',env.APP_ORIGIN).expect(204);assert.deepEqual((await bob.get('/api/me/favorites').expect(200)).body.spotIds,[]);
  await alice.put('/api/me/favorites/unknown').set('Origin',env.APP_ORIGIN).expect(404);
  const suggested=await alice.post('/api/recommendations').set('Origin',env.APP_ORIGIN).send({level:'advanced',availability:'all',scope:'all',min:.5,max:3,wind:25}).expect(200);const c=suggested.body.suggested[0];assert.ok(c);
  const saved=await alice.post('/api/me/sessions').set('Origin',env.APP_ORIGIN).send({spotId:c.spotId,startTime:c.key}).expect(201);await bob.delete('/api/me/sessions/'+saved.body.id).set('Origin',env.APP_ORIGIN).expect(404);assert.equal((await alice.get('/api/me/sessions').expect(200)).body.length,1);
  const cookies=register.headers['set-cookie'];await alice.post('/api/auth/logout').set('Origin',env.APP_ORIGIN).expect(204);await request(server).get('/api/auth/me').set('Cookie',cookies).expect(401);await alice.post('/api/auth/login').set('Origin',env.APP_ORIGIN).send({email,password}).expect(200);assert.equal((await alice.get('/api/me/profile').expect(200)).body.language,'en');
 }finally{await app.close()}
});

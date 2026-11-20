import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PasswordService } from '../src/auth/password.service';
import { AuthService,hashToken,publicUser } from '../src/auth/auth.service';
import { AuthSessionEntity,UserEntity } from '../src/database/entities';
import { Repository,DataSource } from 'typeorm';
test('passwords are salted, hashed and compared without storing plaintext',async()=>{const service=new PasswordService(),password='test-password-1234';const a=await service.hash(password),b=await service.hash(password);assert.notEqual(a,b);assert.ok(!a.includes(password));assert.equal(await service.verify(password,a),true);assert.equal(await service.verify('wrong-password',a),false);assert.equal(await service.verify(password,'broken'),false)});
test('public user representation excludes password hashes',()=>{const user={id:'id',email:'a@example.com',passwordHash:'secret',createdAt:new Date()} as UserEntity;assert.deepEqual(Object.keys(publicUser(user)).sort(),['createdAt','email','id']);});
test('expired sessions and malformed cookies are rejected; logout uses the token hash',async()=>{let deleted:unknown;const token='x'.repeat(43);const sessions={findOneBy:async()=>({expiresAt:new Date(Date.now()-1),userId:'a'}),delete:async(arg:unknown)=>{deleted=arg}} as unknown as Repository<AuthSessionEntity>;const service=new AuthService({}as Repository<UserEntity>,sessions,{}as DataSource,new PasswordService());await assert.rejects(()=>service.authenticate('invalid'));await assert.rejects(()=>service.authenticate(token));await service.logout(token);assert.deepEqual(deleted,{tokenHash:hashToken(token)});assert.ok(!JSON.stringify(deleted).includes(token));});

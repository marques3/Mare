import { randomBytes } from 'node:crypto';
import { readFile,writeFile } from 'node:fs/promises';
const template=await readFile(new URL('../.env.example',import.meta.url),'utf8');
const content=template.replace('replace-with-a-random-password',randomBytes(24).toString('hex')).replace('replace-with-a-different-random-password',randomBytes(24).toString('hex'));
await writeFile(new URL('../.env',import.meta.url),content,{flag:'wx',mode:0o600});
console.log('Created .env with fresh local database credentials. Existing files are never overwritten.');

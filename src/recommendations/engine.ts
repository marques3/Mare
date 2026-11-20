import { SurfProfile } from '../database/entities';
import { Spot } from '../spots/spots.service';
import { ForecastPayload } from '../forecast/forecast.types';
export interface Conditions {height:number|null;period:number|null;wind:number|null;windDir:number|null;waveDir:number|null;}
export interface Candidate {id:string;spotId:string;i:number;date:string;d:number;hour:number;key:string;score:number;minHeight:number;maxHeight:number;maxWind:number;period:number;windType:'fraco'|'offshore'|'onshore'|'lateral';windDir:number;}
const delta=(a:number,b:number)=>Math.abs(((a-b+540)%360)-180);
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
export function scoreConditions(v:Conditions,p:SurfProfile,face:number){
 if(!finite(v.height)||!finite(v.period)||!finite(v.wind)||!finite(v.windDir)||!finite(v.waveDir)||v.height<0||v.period<=0||v.wind<0)return null;
 if(v.height<p.min||v.height>p.max||v.wind>p.wind)return null;
 const middle=(p.min+p.max)/2,half=(p.max-p.min)/2,height=1-.35*Math.abs(v.height-middle)/Math.max(.1,half);
 const angle=delta(v.windDir,face),windType=v.wind<5?'fraco':angle>120?'offshore':angle<60?'onshore':'lateral';
 const wind=(1-.5*v.wind/p.wind)*(windType==='onshore'?.45:windType==='lateral'?.75:1);
 const period=Math.max(.15,Math.min(1,(v.period-4)/8)),exposure=Math.max(.1,Math.cos(delta(v.waveDir,face)*Math.PI/180));
 return {score:Math.round(100*(.5*height+.25*wind+.15*period+.1*exposure)),windType} as {score:number;windType:Candidate['windType']};
}
export function pickSessions(candidates:Candidate[],limit=3):Candidate[]{const selected:Candidate[]=[];for(const c of [...candidates].sort((a,b)=>b.score-a.score||a.key.localeCompare(b.key)||a.i-b.i)){if(selected.some(s=>s.date===c.date&&c.hour<s.hour+2&&s.hour<c.hour+2))continue;selected.push(c);if(selected.length===limit)break}return selected;}
const dateFormat=new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit'});
export function localTime(now:Date){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Lisbon',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(now).replace(' ','T')}
export function generateCandidates(payload:ForecastPayload,spots:Spot[],p:SurfProfile,now=new Date()):Candidate[]{
 const result:Candidate[]=[],today=dateFormat.format(now),current=localTime(now);
 const dates=Array.from({length:7},(_,i)=>{const d=new Date(today+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10)});
 spots.forEach((spot,i)=>{const e=payload.data[i];if(!e)return;const marineIndex=new Map(e.marine.time.map((t,j)=>[t,j])),windIndex=new Map(e.weather.time.map((t,j)=>[t,j]));
 dates.forEach((date,d)=>{const sun=e.daylight.time.indexOf(date),sunrise=e.daylight.sunrise[sun],sunset=e.daylight.sunset[sun];if(!sunrise||!sunset)return;
 for(let h=7;h<=18;h++){const key=date+'T'+String(h).padStart(2,'0')+':00',end=date+'T'+String(h+2).padStart(2,'0')+':00';if(key<=current||key<sunrise||end>sunset)continue;if(p.availability==='morning'&&h+2>12||p.availability==='afternoon'&&h<12)continue;
 const rows=[h,h+1].map(hour=>{const time=date+'T'+String(hour).padStart(2,'0')+':00',m=marineIndex.get(time),w=windIndex.get(time);if(m===undefined||w===undefined)return null;
 const v:Conditions={height:e.marine.wave_height[m],period:e.marine.wave_period[m],waveDir:e.marine.wave_direction[m],wind:e.weather.wind_speed_10m[w],windDir:e.weather.wind_direction_10m[w]};const rating=scoreConditions(v,p,spot.face);return rating?{...v,...rating}:null;});
 if(rows.some(v=>v===null))continue;const valid=rows as (Conditions&{score:number;windType:Candidate['windType']})[];const score=Math.min(...valid.map(v=>v.score));if(score<60)continue;
 result.push({id:date+'_'+h+'_'+i,spotId:spot.id,i,date,d,hour:h,key,score,minHeight:Math.min(...valid.map(v=>v.height!)),maxHeight:Math.max(...valid.map(v=>v.height!)),maxWind:Math.max(...valid.map(v=>v.wind!)),period:Math.min(...valid.map(v=>v.period!)),windType:valid[0].windType,windDir:valid[0].windDir!});
 }});});return result;
}

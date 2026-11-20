import { ForecastPayload } from '../src/forecast/forecast.types';
export function fixture():ForecastPayload{
 const dates=Array.from({length:7},(_,i)=>{const d=new Date('2026-11-12T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10)});
 const time=dates.flatMap(date=>Array.from({length:24},(_,h)=>date+'T'+String(h).padStart(2,'0')+':00'));
 return {data:Array.from({length:11},()=>({marine:{time:[...time],wave_height:time.map(()=>1.2),wave_period:time.map(()=>11),wave_direction:time.map(()=>270)},weather:{time:[...time],wind_speed_10m:time.map(()=>7),wind_direction_10m:time.map(()=>90)},daylight:{time:dates,sunrise:dates.map(d=>d+'T08:00'),sunset:dates.map(d=>d+'T17:00')}}))};
}

import { z } from 'zod';
const times=z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)).min(24).max(400);
const values=z.array(z.number().finite().nullable()).min(24).max(400);
export const marineSchema=z.object({time:times,wave_height:values,wave_period:values,wave_direction:values}).superRefine((v,c)=>{for(const key of ['wave_height','wave_period','wave_direction'] as const)if(v[key].length!==v.time.length)c.addIssue({code:'custom',message:'Mismatched marine time series'});});
export const weatherSchema=z.object({time:times,wind_speed_10m:values,wind_direction_10m:values}).superRefine((v,c)=>{if(v.wind_speed_10m.length!==v.time.length||v.wind_direction_10m.length!==v.time.length)c.addIssue({code:'custom',message:'Mismatched wind time series'});});
export const daylightSchema=z.object({time:z.array(z.string()).min(7),sunrise:z.array(z.string().nullable()).min(7),sunset:z.array(z.string().nullable()).min(7)});
export const forecastPayloadSchema=z.object({data:z.array(z.object({marine:marineSchema,weather:weatherSchema,daylight:daylightSchema})).length(11)});
export type ForecastPayload=z.infer<typeof forecastPayloadSchema>;
export type ForecastResponse=ForecastPayload&{fetchedAt:string;stale:boolean;timezone:'Europe/Lisbon';attribution:string;accessMode:'prototype'|'commercial'};

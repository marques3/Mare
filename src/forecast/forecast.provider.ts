import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { env } from '../common/env';
import { SpotsService } from '../spots/spots.service';
import { ForecastPayload,forecastPayloadSchema,marineSchema,weatherSchema,daylightSchema } from './forecast.types';
@Injectable()export class ForecastProvider {
 constructor(private readonly spots:SpotsService){}
 async fetch():Promise<ForecastPayload>{
  const params=new URLSearchParams({latitude:this.spots.spots.map(s=>s.lat).join(','),longitude:this.spots.spots.map(s=>s.lon).join(','),timezone:'Europe/Lisbon',forecast_days:'7'});
  if(env.OPEN_METEO_API_KEY)params.set('apikey',env.OPEN_METEO_API_KEY);
  const commercial=Boolean(env.OPEN_METEO_API_KEY);
  const marine=new URL('/v1/marine',commercial?'https://customer-marine-api.open-meteo.com':'https://marine-api.open-meteo.com');marine.search=params.toString();marine.searchParams.set('hourly','wave_height,wave_period,wave_direction');marine.searchParams.set('cell_selection','sea');
  const weather=new URL('/v1/forecast',commercial?'https://customer-api.open-meteo.com':'https://api.open-meteo.com');weather.search=params.toString();weather.searchParams.set('hourly','wind_speed_10m,wind_direction_10m');weather.searchParams.set('daily','sunrise,sunset');weather.searchParams.set('wind_speed_unit','kmh');
  const get=async(url:URL):Promise<unknown>=>{const response=await fetch(url,{signal:AbortSignal.timeout(18000)});if(!response.ok)throw new Error('Forecast upstream unavailable');return response.json()};
  const [m,w]=await Promise.all([get(marine),get(weather)]);
  const marineRows=z.array(z.object({hourly:marineSchema})).length(this.spots.spots.length).parse(m);
  const weatherRows=z.array(z.object({hourly:weatherSchema,daily:daylightSchema})).length(this.spots.spots.length).parse(w);
  return forecastPayloadSchema.parse({data:marineRows.map((row,i)=>({marine:row.hourly,weather:weatherRows[i].hourly,daylight:weatherRows[i].daily}))});
 }
}

import { Injectable,NotFoundException } from '@nestjs/common';
import catalog from './spots.json';
export interface Spot {id:string;name:string;town:string;coast:'west'|'south';lat:number;lon:number;face:number;note:string;x:number;y:number;}
@Injectable()export class SpotsService {
 readonly spots=catalog as Spot[];
 list(){return this.spots;}
 get(id:string){const spot=this.spots.find(s=>s.id===id);if(!spot)throw new NotFoundException('SPOT_NOT_FOUND');return spot;}
}

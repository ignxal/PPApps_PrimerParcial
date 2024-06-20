import { SafeUrl } from '@angular/platform-browser';
import { Timestamp } from 'firebase/firestore';
import { TipoCosa } from '../enums/tipoCosa';
import { ICollection } from '../interfaces/iCollection';
import { Voto } from './votos';
export class Foto implements ICollection{
    constructor(public id:string,
        public cosa:TipoCosa,
        public base64:SafeUrl,
        public email:string,
        public fecha:Timestamp,
        public votos:Voto[] = []){}


        public getFechaString (){            
            return this.fecha.toDate().toLocaleString();
        }
}


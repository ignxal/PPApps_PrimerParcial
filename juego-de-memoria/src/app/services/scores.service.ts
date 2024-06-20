import { Injectable } from '@angular/core';
import { Score } from '../models/score';
import { AuthFirebaseService } from './authFirebase.service';
import { CollectionsService } from './collections.service';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  collectionName:string = 'scores';
  constructor(private collections:CollectionsService,private auth:AuthFirebaseService) { }

  add(score:Score){  
    score.email = this.auth.userLogged.email;  
    this.collections.addOne(this.collectionName,score);  
  }

  get(dificultad:string){
    return this.collections.getAllWhereTop<Score>(this.collectionName,'dificultad',dificultad,5,'score');
  
  }

}

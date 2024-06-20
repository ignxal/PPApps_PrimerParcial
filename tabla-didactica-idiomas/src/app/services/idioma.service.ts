import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {

  constructor() { }

    // Observable string sources
    private currentLangSource = new BehaviorSubject<string>('es-ES');
    // 'es', 'br', 'gb'

    // Observable string streams
    currentLang$ = this.currentLangSource.asObservable();
  
    // Service message commands
    setearIdioma(idioma: string) {
      this.currentLangSource.next(idioma);
    }

}

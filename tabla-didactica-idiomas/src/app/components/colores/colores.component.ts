import { Component, OnInit } from '@angular/core';
import { TTSOptions, TextToSpeech } from '@capacitor-community/text-to-speech';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/services/idioma.service';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.component.html',
  styleUrls: ['./colores.component.scss'],
})
export class ColoresComponent  implements OnInit {

  lang: string = 'es-ES';
  subscription!: Subscription;

  constructor(private idiomaService: IdiomaService) { }

  ngOnInit() {
    this.subscription = this.idiomaService.currentLang$.subscribe((lang) => {this.lang = lang;console.log(lang)});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public async speak(text: string): Promise<void> {
    

    const options: TTSOptions = {
      text: text,
      lang: this.lang,
      rate: 0.7,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
      
    };
    await TextToSpeech.speak(options);
  }


  clickBtn(_id: string) {
    let id = parseInt(_id)+1;

    switch (id) {
      case 1:
        switch(this.lang) {
          case 'en-GB':
            this.speak('brown');        
            break;
          case 'es-ES':
            this.speak('marrón');
            break;
          case 'pt-BR':
            this.speak('marrom');
            break;
        }
        break;
      case 2:
        switch(this.lang) {
          case 'en-GB':
            this.speak('red');        
            break;
          case 'es-ES':
            this.speak('rojo');
            break;
          case 'pt-BR':
            this.speak('vermelho');
            break;
        }
        break;
      case 3:
        switch(this.lang) {
          case 'en-GB':
            this.speak('green');        
            break;
          case 'es-ES':
            this.speak('verde');
            break;
          case 'pt-BR':
            this.speak('verde');
            break;
        }
        break;
      case 4:
        switch(this.lang) {
          case 'en-GB':
            this.speak('yellow');        
            break;
          case 'es-ES':
            this.speak('amarillo');
            break;
          case 'pt-BR':
            this.speak('amarelo');
            break;
        }
        break;
      case 5:
        switch(this.lang) {
          case 'en-GB':
            this.speak('sky blue');        
            break;
          case 'es-ES':
            this.speak('celeste');
            break;
          case 'pt-BR':
            this.speak('céu azul');
            break;
        }
        break;
      case 6:
        switch(this.lang) {
          case 'en-GB':
            this.speak('white');        
            break;
          case 'es-ES':
            this.speak('blanco');
            break;
          case 'pt-BR':
            this.speak('branco');
            break;
        }
        break;
      case 7:
        switch(this.lang) {
          case 'en-GB':
            this.speak('orange');        
            break;
          case 'es-ES':
            this.speak('naranja');
            break;
          case 'pt-BR':
            this.speak('laranja');
            break;
        }
        break;
      case 8:
        switch(this.lang) {
          case 'en-GB':
            this.speak('pink');        
            break;
          case 'es-ES':
            this.speak('rosa');
            break;
          case 'pt-BR':
            this.speak('rosa');
            break;
        }
        break;
      default:
        console.log('default')
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { TTSOptions, TextToSpeech } from '@capacitor-community/text-to-speech';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/services/idioma.service';

@Component({
  selector: 'app-animales',
  templateUrl: './animales.component.html',
  styleUrls: ['./animales.component.scss'],
})
export class AnimalesComponent implements OnInit {

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


  clickBtn(id: number) {

    switch (id) {
      case 1:
        switch(this.lang) {
          case 'en-GB':
            this.speak('snake');        
            break;
          case 'es-ES':
            this.speak('serpiente');
            break;
          case 'pt-BR':
            this.speak('serpente');
            break;
        }
        break;
      case 2:
        switch(this.lang) {
          case 'en-GB':
            this.speak('horse');        
            break;
          case 'es-ES':
            this.speak('caballo');
            break;
          case 'pt-BR':
            this.speak('cavalo');
            break;
        }
        break;
      case 3:
        switch(this.lang) {
          case 'en-GB':
            this.speak('cat');        
            break;
          case 'es-ES':
            this.speak('gato');
            break;
          case 'pt-BR':
            this.speak('gato');
            break;
        }
        break;
      case 4:
        switch(this.lang) {
          case 'en-GB':
            this.speak('tortoise');        
            break;
          case 'es-ES':
            this.speak('tortuga');
            break;
          case 'pt-BR':
            this.speak('tartaruga');
            break;
        }
        break;
      case 5:
        switch(this.lang) {
          case 'en-GB':
            this.speak('lion');        
            break;
          case 'es-ES':
            this.speak('león');
            break;
          case 'pt-BR':
            this.speak('leão');
            break;
        }
        break;
      case 6:
        switch(this.lang) {
          case 'en-GB':
            this.speak('monkey');        
            break;
          case 'es-ES':
            this.speak('mono');
            break;
          case 'pt-BR':
            this.speak('pão');
            break;
        }
        break;
      case 7:
        switch(this.lang) {
          case 'en-GB':
            this.speak('dog');        
            break;
          case 'es-ES':
            this.speak('perro');
            break;
          case 'pt-BR':
            this.speak('cachorro');
            break;
        }
        break;
      case 8:
        switch(this.lang) {
          case 'en-GB':
            this.speak('cow');        
            break;
          case 'es-ES':
            this.speak('vaca');
            break;
          case 'pt-BR':
            this.speak('vaca');
            break;
        }
        break;
      default:
        console.log('default')
    }
  }

}

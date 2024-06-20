import { Component, OnInit } from '@angular/core';
import { TTSOptions, TextToSpeech } from '@capacitor-community/text-to-speech';
import { Subscription } from 'rxjs';
import { IdiomaService } from 'src/app/services/idioma.service';

@Component({
  selector: 'app-numeros',
  templateUrl: './numeros.component.html',
  styleUrls: ['./numeros.component.scss'],
})
export class NumerosComponent  implements OnInit {

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

}
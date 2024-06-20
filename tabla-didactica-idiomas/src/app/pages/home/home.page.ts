import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/classes/user/person';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
import { IdiomaService } from '../../services/idioma.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario!: Person;
  idioma!:string
  categoria:string = 'animales'

  constructor(private auth: AuthFirebaseService,private router:Router,private idiomaService:IdiomaService) { }

  ngOnInit(): void {
    // Lógica de inicialización, obtención de datos de usuario, etc.
    this.usuario = this.auth.userLogged
  }


  cambiarCategoria(categoria:string){
    this.categoria = categoria;
  }

  cambiarIdioma(idioma:string){   
    this.idiomaService.setearIdioma(idioma); 
    switch(idioma) {
      case 'en-GB':
        this.idioma = "fi fi-gb fis rounded-circle";
        break;
      case 'es-ES':
        this.idioma = "fi fi-es fis rounded-circle";
        break;
      case 'pt-BR':
        this.idioma = "fi fi-br fis rounded-circle";
        break;
    }
  }
}

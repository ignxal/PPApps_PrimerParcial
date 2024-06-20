import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from 'src/app/classes/user/person';
import { AuthFirebaseService } from 'src/app/services/authFirebase.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario!: Person;
  alarmaActivada:boolean = false

  constructor(private auth: AuthFirebaseService,
    private router: Router) { }

  

  ngOnInit(): void {   
    this.usuario = this.auth.userLogged
  }

  irAFacil(){
    this.router.navigateByUrl('facil')
  }

  irAMedio(){
    this.router.navigateByUrl('medio')
  }

  irADificil(){
    this.router.navigateByUrl('dificil')
  }
  irAScores(){
    this.router.navigateByUrl('scores')
  }
}

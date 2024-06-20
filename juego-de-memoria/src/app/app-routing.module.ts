import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/guards/auth.guard';
import { loginGuard } from 'src/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash-screen',
    pathMatch: 'full'
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./pages/splash-screen/splash-screen.module').then( m => m.SplashScreenPageModule)
    ,canActivate: [loginGuard]  
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
    ,canActivate: [authGuard]  
  },
  
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
    ,canActivate: [loginGuard] 
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
    ,canActivate: [loginGuard]  
  },   {
    path: 'facil',
    loadChildren: () => import('./pages/facil/facil.module').then( m => m.FacilPageModule)
  },
  {
    path: 'medio',
    loadChildren: () => import('./pages/medio/medio.module').then( m => m.MedioPageModule)
  },
  {
    path: 'dificil',
    loadChildren: () => import('./pages/dificil/dificil.module').then( m => m.DificilPageModule)
  },
  {
    path: 'scores',
    loadChildren: () => import('./pages/scores/scores.module').then( m => m.ScoresPageModule)
  },
 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

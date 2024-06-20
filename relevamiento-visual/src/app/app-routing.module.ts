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
  },
  {
    path: 'cosas-lindas',
    loadChildren: () => import('./pages/cosas-lindas/cosas-lindas.module').then( m => m.CosasLindasPageModule)
    ,canActivate: [authGuard]  
  },
  {
    path: 'cosas-feas',
    loadChildren: () => import('./pages/cosas-feas/cosas-feas.module').then( m => m.CosasFeasPageModule)
    ,canActivate: [authGuard]  
  },
  {
    path: 'mis-fotos',
    loadChildren: () => import('./pages/mis-fotos/mis-fotos.module').then( m => m.MisFotosPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

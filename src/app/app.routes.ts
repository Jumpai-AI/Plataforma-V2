import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { ControleComponent } from '../pages/controle/controle.component';
import { DificuldadeComponent } from '../pages/dificuldade/dificuldade.component';
import { SistemaSolarComponent } from '../pages/jogos/dificil/sistema-solar/sistema-solar.component';

export const routes: Routes = [
    { path: '', component: ControleComponent },
    { path: 'sistema-solar/:tipo', component: SistemaSolarComponent },
];

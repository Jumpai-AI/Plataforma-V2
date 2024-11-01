import { Routes } from '@angular/router';
import { ControleComponent } from '../pages/controle/controle.component';
import { CalibragemOlhoComponent } from '../pages/calibragem/calibragem-olho/calibragem-olho.component';
import { JogosComponent } from '../pages/jogos/jogos.component';

export const routes: Routes = [
    { path: '', component: ControleComponent },
    { path: 'calibragem-olho', component: CalibragemOlhoComponent },
    { path: 'jogos', component: JogosComponent },
];

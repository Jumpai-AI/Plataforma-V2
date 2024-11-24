import { Routes } from '@angular/router';
import { OpcoesJogosComponent } from '../pages/opcoes-jogos/opcoes-jogos.component';
import { CalibragemOlhoComponent } from '../pages/calibragem/calibragem-olho/calibragem-olho.component';
import { DificuldadeComponent } from '../pages/dificuldade/dificuldade.component';
import { ControleComponent } from '../pages/controle/controle.component';
import { SistemaSolarFacilComponent } from '../pages/jogos/sistemaSolar/sistema-solar-facil/sistema-solar-facil.component';
import { SistemaSolarMedioComponent } from '../pages/jogos/sistemaSolar/sistema-solar-medio/sistema-solar-medio.component';
import { SistemaSolarDificilComponent } from '../pages/jogos/sistemaSolar/sistema-solar-dificil/sistema-solar-dificil.component';

export const routes: Routes = [
    { path: '', component: ControleComponent },
    { path: 'calibragem-olho', component: CalibragemOlhoComponent },
    { path: 'jogos/:controle', component: OpcoesJogosComponent},
    { path: 'dificuldade/:jogo/:controle', component: DificuldadeComponent},
    {
        path: 'sistema-solar/:controle',
        children: [
          { path: 'facil', component: SistemaSolarFacilComponent },
          { path: 'medio', component: SistemaSolarMedioComponent },
          { path: 'dificil', component: SistemaSolarDificilComponent },
        ]
    }
];

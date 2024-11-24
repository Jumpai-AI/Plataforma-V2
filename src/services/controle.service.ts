import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BlinkService } from './piscada.service';

@Injectable({
  providedIn: 'root'
})
export class ControleService {

  private controleOcularAtivadoSubject = new BehaviorSubject<boolean>(false);
  controleOcularAtivado$ = this.controleOcularAtivadoSubject.asObservable();

  // Variável global acessível de qualquer lugar
  static valorMedioCalibragem: number = 0;  

  //Ativa a visualização da camera
  ativarControleOcular() {
    this.controleOcularAtivadoSubject.next(true);
  }

  //Desativa a visualização da camera
  desativarControleOcular() {
    this.controleOcularAtivadoSubject.next(false);
  }

  // Método para atualizar o valor médio de calibragem
  static atualizarValorMedioCalibragem(valor: number) {
    ControleService.valorMedioCalibragem = valor;
  }

  // Método para obter o valor médio de calibragem
  static obterValorMedioCalibragem(): number {
    return ControleService.valorMedioCalibragem;
  }
}

import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnDestroy, inject } from '@angular/core';
import { BlinkService } from '../../../services/piscada.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../app/shared/shared.module';

@Component({
  selector: 'app-calibragem-olho',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './calibragem-olho.component.html',
  styleUrls: ['./calibragem-olho.component.scss']
})
export class CalibragemOlhoComponent implements OnDestroy {

  private _blinkService = inject(BlinkService);
  private _router = inject(Router);

  tempoRestante: number = 8; 
  contagem: any;
  calibrando = false;
  testando = false;
  calibrageFinalizada = false;
  calibragemStatus = '';
  circuloCor: string = 'branco'; 

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>; 

  // Assinatura da piscada
  private blinkSubscription: any;

  constructor() { 
    this.blinkSubscription = this._blinkService.piscadaDetectada.subscribe(() => {
      this.circuloCor = 'verde';
      setTimeout(() => {
        this.circuloCor = 'branco';
      }, 2000);  
    });
  } 

  iniciarCalibragem() {
    this.calibrando = true;
    this.calibragemStatus = '';
    this.tempoRestante = 8; 

    this._blinkService.registrarAlturasDosOlhos(this.videoElement.nativeElement)
      .then(() => {
        clearInterval(this.contagem);
        this.calibrando = false; 
        this.calibrageFinalizada = true;
      })
      .catch((error) => {
        console.error("Erro durante a calibração:", error);
        this.calibrando = false;
      });

    this.contagem = setInterval(() => {
      if (this.tempoRestante <= 0) {
        clearInterval(this.contagem);
      } else {
        this.tempoRestante--;
      }
    }, 1000);
  }

  iniciarTeste() {
    this.testando = true; 
    this._blinkService.iniciarTestePiscadas(this.videoElement.nativeElement)
      .then(() => {
        this.calibragemStatus = 'S';
        this.testando = false;
        this._router.navigate(['/jogos', 'ocular']);
      })
      .catch((error) => {
        this.calibragemStatus = 'E';
        this.calibrando = false;
        this.testando = false;      
      });
  }

  // Função que será chamada quando o componente for destruído
  ngOnDestroy(): void {

    // Limpa qualquer intervalo que esteja rodando
    if (this.contagem) {
      clearInterval(this.contagem);
    }

    // Desassocia a assinatura de piscada, se houver
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
  }
}

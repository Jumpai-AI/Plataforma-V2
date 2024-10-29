import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { BlinkService } from '../../../services/piscada.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-calibragem-olho',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon],
  templateUrl: './calibragem-olho.component.html',
  styleUrls: ['./calibragem-olho.component.scss']
})
export class CalibragemOlhoComponent {
  tempoRestante: number = 8; 
  contagem: any;
  calibrando = false;
  testando = false;
  calibrageFinalizada = false;
  calibragemStatus = '';
  circuloCor: string = 'branco'; 

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>; 

  constructor(private blinkService: BlinkService) { 
    this.blinkService.piscadaDetectada.subscribe(() => {
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

    this.blinkService.registrarAlturasDosOlhos(this.videoElement.nativeElement)
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
    this.blinkService.iniciarTestePiscadas(this.videoElement.nativeElement)
      .then(() => {
        this.calibragemStatus = 'S';
        this.testando = false;      
      })
      .catch((error) => {
        this.calibragemStatus = 'E';
        this.calibrando = false;
        this.testando = false;      
      });
  }
}

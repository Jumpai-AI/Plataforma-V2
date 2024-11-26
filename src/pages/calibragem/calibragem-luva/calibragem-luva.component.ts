import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SharedModule } from '../../../app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LuvaService } from '../../../services/luva.service';

@Component({
  selector: 'app-calibragem-luva',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './calibragem-luva.component.html',
  styleUrl: './calibragem-luva.component.scss'
})
export class CalibragemLuvaComponent implements OnInit, OnDestroy {
  
  private _luvaService = inject(LuvaService);  // Injeção do serviço
  private _router = inject(Router);  // Injeção do Router
  private cdr = inject(ChangeDetectorRef);  // Injeção do serviço

  progressValue: number = 0;  // Valor inicial da barra (50%)
  tempoRestante: number = 8; 
  contagem: any;
  calibrando = false;
  testando = false;
  calibrageFinalizada = false;
  calibragemStatus = '';
  circuloCor: string = 'branco'; 

  // Assinatura da piscada
  private blinkSubscription: any;

  ngOnInit(): void {
    // Iniciar calibração quando o componente for carregado
    this.iniciarCalibragem();
  }

  iniciarCalibragem(): void {
    this.calibrando = true;
    this.calibragemStatus = '';
    this.progressValue = 0;  // Resetando o progresso

    // Chamando o método para iniciar o progresso da calibragem
    this._luvaService.iniciarProgressoCalibragem(); 

    // Subscrição do progresso
    this._luvaService.getProgresso().subscribe((progresso: number) => {
      this.progressValue = progresso; // Atualiza o valor da barra de progresso
      this.cdr.detectChanges(); // Força a detecção de mudanças para atualizar a tela

      // Verifica se a calibração foi finalizada
      if (this.progressValue >= 100) {
        this.calibrando = false;
        this.calibrageFinalizada = true;
        this.calibragemStatus = 'Calibração Finalizada';
        this._router.navigate(['/jogos', 'manual']);
      }
    });
  }

  ngOnDestroy(): void {
    // Limpa qualquer intervalo ou assinaturas quando o componente for destruído
    if (this.contagem) {
      clearInterval(this.contagem);
    }

    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
  }
}

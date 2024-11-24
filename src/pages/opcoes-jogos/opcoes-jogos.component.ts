import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, inject, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormasComponent } from "../../componentes/formas/formas.component";
import { BlinkService } from '../../services/blickService.service';
import { SharedModule } from '../../app/shared/shared.module';
import { ComunicacaoService } from '../../services/comunicacao.service';
import { LuvaService } from '../../services/luva.service';

@Component({
  selector: 'app-opcoes-jogos',
  standalone: true,
  imports: [CommonModule, FormasComponent, SharedModule],
  templateUrl: './opcoes-jogos.component.html',
  styleUrl: './opcoes-jogos.component.scss'
})
export class OpcoesJogosComponent {

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _blinkService = inject(BlinkService);
  private _luvaService = inject(LuvaService);
  private _comunicacaoService = inject(ComunicacaoService);
  private ngZone = inject(NgZone);

  selectedCardIndex: number = -1; // Nenhum cartão selecionado inicialmente
  intervalId: any;
  blinkSubscription: any;
  movimentoSubscription: any;
  controle: string | null | undefined;
  totalCards: number = 3;

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.controle = params.get('controle');
    });

    if (this.controle !== 'teclado') {
      this.startCardSelection();

      if(this.controle == 'ocular'){
        this.blinkSubscription = this._blinkService.blinkDetected.subscribe(() => {
          this.selectCardOnBlink();
        });
      }

      if(this.controle == 'manual'){
        this.movimentoSubscription = this._luvaService.movimentoDetectado.subscribe(() => {
          console.log('Movimento detectado na luva!');
          this.selectCardOnBlink();  // Exemplo de ação, você pode mudar isso
        });
      }
    }


  }

  ngOnDestroy(): void {
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }

    if (this.movimentoSubscription) {
      this.movimentoSubscription.unsubscribe();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCardSelection(): void {
    if (this.controle === 'teclado') {
      // Se for controle via teclado, não altere o índice de seleção
      this.selectedCardIndex = -1;
      return;
    }

    // Lógica de seleção de cartões fora da zona angular para não causar alterações inesperadas
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        this.ngZone.run(() => {
          this.selectedCardIndex = (this.selectedCardIndex + 1) % this.totalCards;
        });
      }, 1500);
    });
  }

  selectCardOnBlink(): void {
    // Implementação da navegação ao detectar o piscar
    if (this.selectedCardIndex !== -1) { // Não navega se nenhum card estiver selecionado
      switch (this.selectedCardIndex) {
        case 0:
          this.sistemaSolar();
          break;
        case 1:
          this.numeros();
          break;
        case 2:
          this.festivalCores();
          break;
        default:
          break;
      }
    }
  }

  sistemaSolar(): void {
    this._router.navigate(['/dificuldade', 'sistema-solar', this.controle]);
  }

  numeros(): void {
    this._comunicacaoService.avisoManutencao();
  }

  festivalCores(): void {
    this._comunicacaoService.avisoManutencao();
  }



}

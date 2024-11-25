import { Component, inject, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormasComponent } from '../../componentes/formas/formas.component';
import { BlinkService } from '../../services/blickService.service';
import { SharedModule } from '../../app/shared/shared.module';
import { ComunicacaoService } from '../../services/comunicacao.service';

@Component({
  selector: 'app-dificuldade',
  standalone: true,
  imports: [FormasComponent, SharedModule],
  templateUrl: './dificuldade.component.html',
  styleUrl: './dificuldade.component.scss'
})
export class DificuldadeComponent {

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _blinkService = inject(BlinkService);
  private _comunicacaoService = inject(ComunicacaoService);
  private ngZone = inject(NgZone);

  selectedCardIndex: number = -1; // Nenhum cartão selecionado inicialmente
  intervalId: any;
  blinkSubscription: any;
  controle: string | null | undefined;
  jogo: string | null | undefined;

  totalCards: number = 4;

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.controle = params.get('controle');
      this.jogo = params.get('jogo'); 
    });


    if (this.controle !== 'teclado') {
      this.startCardSelection();

      this.blinkSubscription = this._blinkService.blinkDetected.subscribe(() => {
        this.selectCardOnBlink();
      });
    }


  }

  ngOnDestroy(): void {
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
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
          this.facil();
          break;
        case 1:
          this.medio();
          break;
        case 2:
          this.dificil();
          break;
        case 3:
          this.desafio();
          break;
        default:
          break;
      }
    }
  }


  /* facil():void{
    this._comunicacaoService.avisoManutencao();
  }

  medio():void{
    this._comunicacaoService.avisoManutencao();
  } */
  
  facil():void{
    this._router.navigate([this.jogo, this.controle, 'facil']);
  }

  medio():void{
    this._router.navigate([this.jogo, this.controle, 'medio']);
  }
    
  dificil():void{
    this._router.navigate([this.jogo, this.controle, 'dificil']);
  }

  desafio():void{
    this._comunicacaoService.avisoManutencao();
  }

}

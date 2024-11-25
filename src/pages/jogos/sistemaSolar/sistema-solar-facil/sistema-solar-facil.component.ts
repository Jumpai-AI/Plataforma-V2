import { Component, ElementRef, HostListener, inject, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CeuEstreladoComponent } from "../../../../componentes/ceu-estrelado/ceu-estrelado.component";
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicacaoService } from '../../../../services/comunicacao.service';
import { BlinkService } from '../../../../services/blickService.service';

@Component({
  selector: 'app-sistema-solar-facil',
  standalone: true,
  imports: [CeuEstreladoComponent],
  templateUrl: './sistema-solar-facil.component.html',
  styleUrl: './sistema-solar-facil.component.scss'
})
export class SistemaSolarFacilComponent {

  private intervaloPlanetas: any = null;
  private intervaloSelecao: any = null;
  private botoesPopup: HTMLElement[] = [];

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  personagem: HTMLElement | null = null;
  gameContainer: HTMLElement | null = null;
  coracoes: HTMLElement[] = [];
  vidas: number = 5;
  planetasColetados: HTMLElement | null = null;
  popupVitoria: HTMLElement | null = null;
  popupDerrota: HTMLElement | null = null;
  textoPopupVitoria: HTMLElement | null = null;
  textoPopupDerrota: HTMLElement | null = null;
  botaoPopupVitoria: HTMLElement | null = null;
  botaoTentarNovamente: HTMLElement | null = null;
  botaoSair: HTMLElement | null = null;

  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  ordemPlanetas: string[] = ["Mercúrio", "Vênus", "Terra", "Marte", "Júpiter", "Saturno", "Urano", "Netuno"];
  imagensPlanetas: { [key: string]: string } = {
    "Mercúrio": "../../../../assets/image/jogos/sistema-solar/mercurio.png",
    "Vênus": "../../../../assets/image/jogos/sistema-solar/venus.png",
    "Terra": "../../../../assets/image/jogos/sistema-solar/terra.png",
    "Marte": "../../../../assets/image/jogos/sistema-solar/marte.png",
    "Júpiter": "../../../../assets/image/jogos/sistema-solar/jupiter.png",
    "Saturno": "../../../../assets/image/jogos/sistema-solar/saturno.png",
    "Urano": "../../../../assets/image/jogos/sistema-solar/urano.png",
    "Netuno": "../../../../assets/image/jogos/sistema-solar/netuno.png"
  };
  indicePlanetaAtual: number = 0;

  //trilhaSonora: HTMLAudioElement | null = null;
  somVitoria: HTMLAudioElement | null = null;
  somDerrota: HTMLAudioElement | null = null;

  blinkData: string[] = [];
  acao: boolean = false;

  controle: string | null | undefined;
  jogo: string | null | undefined;

  private _blinkService = inject(BlinkService);
  blinkSubscription: any;



  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.personagem = this.elementRef.nativeElement.querySelector('#personagem');
      this.gameContainer = this.elementRef.nativeElement.querySelector('#game-container');
      this.coracoes = Array.from(this.elementRef.nativeElement.querySelectorAll('.coracao'));
      this.vidas = this.coracoes.length;
      this.planetasColetados = this.elementRef.nativeElement.querySelector('#planetas-coletados');
      this.popupVitoria = this.elementRef.nativeElement.querySelector('#popup-vitoria');
      this.popupDerrota = this.elementRef.nativeElement.querySelector('#popup-derrota');
      this.textoPopupVitoria = this.elementRef.nativeElement.querySelector('#texto-popup-vitoria');
      this.textoPopupDerrota = this.elementRef.nativeElement.querySelector('#texto-popup-derrota');
      this.botaoPopupVitoria = this.elementRef.nativeElement.querySelector('#botao-popup-vitoria');
      this.botaoTentarNovamente = this.elementRef.nativeElement.querySelector('#botao-tentar-novamente');
      this.botaoSair = this.elementRef.nativeElement.querySelector('#botao-sair');

      this._route.paramMap.subscribe(params => {
        this.controle = params.get('controle');
      });
    
  
      if (this.controle !== 'teclado') {
  
        this.blinkSubscription = this._blinkService.blinkDetected.subscribe(() => {
          if (!this.acao) {
            this.subir();
            this.acao = true;
          } else {
            this.descer();
            this.acao = false;
          }
        
        });
      }
  
      this.botaoPopupVitoria?.addEventListener('click', () => this.hidePopup());
      this.botaoTentarNovamente?.addEventListener('click', () => this.hidePopup());
      this.botaoSair?.addEventListener('click', () => this.goToHome());

      setInterval(() => this.criarPlaneta(), 3000);
    }
  }


  chamarService(tipo: string): void {
    const apiUrl: string = tipo === 'luva' ?
      'http://localhost:3000/conectado/luva' :
      tipo === 'olho' ?
      'http://localhost:3000/conectado/olho' :
      (() => { console.error('Tipo inválido:', tipo); return ''; })(); 

    if (!apiUrl) return;

    // this.apiService.getBlinkData(apiUrl).subscribe({
    //   next: (data: string) => {
    //     if (!this.acao) {
    //       this.blinkData.push(data);
    //       this.subir();
    //       this.acao = true;
    //     } else {
    //       this.blinkData.push(data);
    //       this.descer();
    //       this.acao = false;
    //     }
    //   },
    //   error: (error: any) => {
    //     console.error('Erro ao consumir a API:', error);
    //   }
    // });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.subir();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.descer();
    }
  }

  subir(): void {
    if (this.personagem) {
      this.animatePersonagem('70%');
    }
  }

  descer(): void {
    if (this.personagem) {
      this.animatePersonagem('50px');
    }
  }

  animatePersonagem(targetPosition: string): void {
    if (this.personagem) {
      this.renderer.setStyle(this.personagem, 'transition', 'bottom 2s');
      this.renderer.setStyle(this.personagem, 'bottom', targetPosition);
    }
  }

  private ultimoPlaneta: string | null = null;

  criarPlaneta(): void {
      const planetasRestantes = this.ordemPlanetas.slice(this.indicePlanetaAtual);
      if (planetasRestantes.length === 0) {
          return;
      }

      const planetasParaEscolher = planetasRestantes.slice(0, 3);
      let nomePlaneta: string;

      // Se houver apenas um planeta restante, permite repetir
      if (planetasRestantes.length === 1) {
          nomePlaneta = planetasRestantes[0];
      } else {
          // Filtra os planetas para não escolher o último
          const planetasFiltrados = planetasParaEscolher.filter(nome => nome !== this.ultimoPlaneta);
          
          // Se todos os planetas foram filtrados, escolhe um aleatoriamente entre os restantes
          if (planetasFiltrados.length === 0) {
              nomePlaneta = planetasParaEscolher[Math.floor(Math.random() * planetasParaEscolher.length)];
          } else {
              nomePlaneta = planetasFiltrados[Math.floor(Math.random() * planetasFiltrados.length)];
          }
      }

      this.ultimoPlaneta = nomePlaneta; // Atualiza o último planeta escolhido

      let planeta = this.renderer.createElement('div');
      this.renderer.addClass(planeta, 'planeta');
      this.renderer.setStyle(planeta, 'backgroundImage', `url(${this.imagensPlanetas[nomePlaneta]})`);
      this.renderer.setAttribute(planeta, 'data-name', nomePlaneta);
      this.renderer.setStyle(planeta, 'bottom', `${40 + Math.random()*20}%`);
      this.renderer.appendChild(this.gameContainer!, planeta);
      this.moverPlaneta(planeta);
  }


  moverPlaneta(planeta: HTMLElement): void {
    let intervaloPlaneta = setInterval(() => {
      let planetaRight = parseInt(getComputedStyle(planeta).right);
      let personagemBottom = parseInt(getComputedStyle(this.personagem!).bottom);
      let personagemLeft = parseInt(getComputedStyle(this.personagem!).left);
      let personagemRight = personagemLeft + this.personagem!.offsetWidth;
      let planetaLeft = window.innerWidth - planetaRight;
      let planetaTop = parseInt(getComputedStyle(planeta).bottom);
      let planetaBottom = planetaTop + planeta.offsetHeight;

      if (planetaRight >= window.innerWidth) {
        planeta.remove();
        clearInterval(intervaloPlaneta);
      } else {
        planeta.style.right = planetaRight + 5 + 'px'; //velocidade
      }

      if (
        planetaLeft < personagemRight && personagemLeft &&
        planetaLeft + planeta.offsetWidth > personagemRight &&
        personagemBottom < planetaBottom &&
        personagemBottom + this.personagem!.offsetHeight > planetaTop
      ) {
        let nomePlaneta = planeta.getAttribute('data-name')!;
        if (nomePlaneta === this.ordemPlanetas[this.indicePlanetaAtual]) {
          this.planetasColetados!.innerHTML += `<div><img src="${this.imagensPlanetas[nomePlaneta]}" alt="${nomePlaneta}" width="50"></div>`;
          this.indicePlanetaAtual++;

          //this.regenerarVida();

          if (this.indicePlanetaAtual === this.ordemPlanetas.length) {
            this.showPopup('win', 'PARABÉNS!');
          }
        } else {
          this.perderVida();
        }
        planeta.remove();
        clearInterval(intervaloPlaneta);
      }
    }, 20);
  }

  perderVida(): void {
    if (this.vidas > 0) {
      this.vidas--;
      this.coracoes[this.vidas].style.display = 'none';
    }
    if (this.vidas === 0) {
      this.showPopup('lose', 'GAME OVER');
    }
  }

  /* regenerarVida(): void {
    if (this.vidas < 3) {
      this.coracoes[this.vidas].style.display = 'inline-block';
      this.vidas++;
    }
  } */

  showPopup(status: 'win' | 'lose', message: string): void {
    // Pausar geração de planetas
    if (this.intervaloPlanetas) {
      clearInterval(this.intervaloPlanetas);
      this.intervaloPlanetas = null;
    }
    
    // Ocultar elementos do jogo
    if (this.personagem) this.renderer.setStyle(this.personagem, 'visibility', 'hidden');
    if (this.planetasColetados) this.renderer.setStyle(this.planetasColetados, 'visibility', 'hidden');
    if (this.gameContainer) {
      const planetas = this.gameContainer.querySelectorAll('.planeta');

      planetas.forEach(planeta => this.renderer.setStyle(planeta, 'visibility', 'hidden'));
    }
    this.coracoes.forEach(coracao => this.renderer.setStyle(coracao, 'visibility', 'hidden'));


    // Mostrar popup
    if (status === 'win') {
      this.textoPopupVitoria!.textContent = message;
      this.popupVitoria!.style.display = 'block';
      this.somVitoria?.play();
    } else {
      this.textoPopupDerrota!.textContent = message;
      this.popupDerrota!.style.display = 'block';
    }
  }

  hidePopup(): void {
    // Restaurar visibilidade dos elementos do jogo
    if (this.personagem) this.renderer.setStyle(this.personagem, 'visibility', 'visible');
    if (this.planetasColetados) this.renderer.setStyle(this.planetasColetados, 'visibility', 'visible');
    if (this.gameContainer) {
      const planetas = this.gameContainer.querySelectorAll('.planeta');

      planetas.forEach(planeta => this.renderer.setStyle(planeta, 'visibility', 'visible'));
    }
    this.coracoes.forEach(coracao => this.renderer.setStyle(coracao, 'visibility', 'visible'));


    // Reiniciar geração de planetas
    this.intervaloPlanetas = setInterval(() => this.criarPlaneta(), 2000);

    // Esconder popups
    this.popupVitoria!.style.display = 'none';
    this.popupDerrota!.style.display = 'none';

    this.resetGame();
  }


  goToHome(): void {
    this.router.navigate(['/jogos', this.controle]);
  }

  resetGame(): void {
    this.vidas = 5;
    this.coracoes.forEach(coracao => coracao.style.display = 'inline-block');
    this.indicePlanetaAtual = 0;
    this.planetasColetados!.innerHTML = '';
  }
}

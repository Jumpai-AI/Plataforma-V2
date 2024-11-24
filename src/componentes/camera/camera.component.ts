import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BlinkService } from '../../services/blickService.service';
import interact from 'interactjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('containerCamera') containerCamera!: ElementRef;

  private assinaturas: Subscription[] = [];
  private servicoBlink = inject(BlinkService);
  private plataformaId = inject(PLATFORM_ID);

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.plataformaId)) {
      this.iniciarFaceMesh();
    }
    this.configurarArrasto();
  }

  ngOnDestroy(): void {
    this.limparAssinaturas();
  }

  // Inicializa o FaceMesh usando o serviço Blink
  private iniciarFaceMesh(): void {
    setTimeout(() => {
      this.servicoBlink.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
        .catch((erro) => console.error('Erro ao inicializar o FaceMesh:', erro));
    }, 0);
  }


  // Configura a funcionalidade de arrasto usando o interact.js
  private configurarArrasto(): void {
    interact(this.containerCamera.nativeElement)
      .draggable({ onmove: this.noMovimentoArrasto });
  }

  // Listener de movimento de arrasto do interact.js
  private noMovimentoArrasto(event: any): void {
    const alvo = event.target;
    const x = (parseFloat(alvo.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(alvo.getAttribute('data-y')) || 0) + event.dy;

    alvo.style.transform = `translate(${x}px, ${y}px)`;
    alvo.setAttribute('data-x', x);
    alvo.setAttribute('data-y', y);
  }

  // Limpa todas as assinaturas para evitar vazamentos de memória
  private limparAssinaturas(): void {
    this.assinaturas.forEach(sub => sub.unsubscribe());
  }
}

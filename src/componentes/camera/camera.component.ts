import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlinkService } from '../../services/blink.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import interact from 'interactjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('containerCamera') containerCamera!: ElementRef;

  private subscription: Subscription | undefined;
  private blinkSubscription: Subscription | undefined;
  private intervalSubscription: Subscription | undefined;

  constructor(
    private blinkService: BlinkService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.blinkService.initializeFaceMesh(this.videoElement.nativeElement, this.canvasElement.nativeElement)
          .catch((error) => console.error("Erro ao inicializar FaceMesh:", error));
      }, 0);
    }

    // Configurar o Interact.js
    interact(this.containerCamera.nativeElement)
      .draggable({
        onmove: this.dragMoveListener,
      });
  }

  dragMoveListener(event: any) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.blinkSubscription) {
      this.blinkSubscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
}

import { Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CameraComponent } from '../../componentes/camera/camera.component';
import { ControleService } from '../../services/controle.service';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CameraComponent],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent {

  public _controleService = inject(ControleService);

  isDesktop = true;
  isLoading = false;
  isLogado = false;
  controleOcular = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }


}

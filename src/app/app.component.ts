import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { CameraComponent } from '../componentes/camera/camera.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TemplateComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Plataforma';
}

import { Component } from '@angular/core';
import { FormasComponent } from "../../componentes/formas/formas.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [FormasComponent],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.scss'
})
export class ControleComponent {

  constructor(private router: Router) {}

  controleOcular():void{
    this.router.navigate(['/calibragem-olho']);
  }

  controleLuva():void{
    
  }
  
  controleTeclado():void{
    
  }



}

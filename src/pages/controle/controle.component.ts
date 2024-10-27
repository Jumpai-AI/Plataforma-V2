import { Component } from '@angular/core';
import { FormasComponent } from "../../componentes/formas/formas.component";

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [FormasComponent],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.scss'
})
export class ControleComponent {

  controleOcular():void{

  }

  controleLuva():void{
    
  }
  
  controleTeclado():void{
    
  }



}

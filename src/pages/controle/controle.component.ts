import { Component, inject, OnInit } from '@angular/core';
import { FormasComponent } from "../../componentes/formas/formas.component";
import { Router } from '@angular/router';
import { ControleService } from '../../services/controle.service';

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [FormasComponent],
  templateUrl: './controle.component.html',
  styleUrl: './controle.component.scss'
})
export class ControleComponent implements OnInit {

  private _controleService = inject(ControleService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._controleService.desativarControleOcular();
  }

  controleOcular():void{
    this._controleService.ativarControleOcular();
    this._router.navigate(['/calibragem-olho']);
  }

  controleLuva():void{
    
  }
  
  controleTeclado():void{
    this._router.navigate(['/jogos', 'teclado']);
  }

}

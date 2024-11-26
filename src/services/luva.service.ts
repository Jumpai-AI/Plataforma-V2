import { EventEmitter, inject, Injectable } from '@angular/core';
import { ComunicacaoService } from './comunicacao.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LuvaService {
  private progressValue: number = 0;
  private isCalibrating: boolean = false;
  private url: string = 'http://localhost:3000/conectado/luva';  // Definindo a rota diretamente na classe
  public movimentoDetectado = new EventEmitter<void>();  // Evento de movimento detectado

  private _comunicacaoService = inject(ComunicacaoService);

  // Aqui criamos um Subject para emitir o progresso
  private progressoSubject = new Subject<number>();

  constructor() {}

  // Método que vai iniciar o progresso da calibragem
  iniciarProgressoCalibragem(): void {
    let progresso = 0;

    try {
      const eventSource = new EventSource(this.url);

      eventSource.onmessage = (event: MessageEvent) => {
        const dados = JSON.parse(event.data);

        console.log(dados);
        
        // Verifica o status da calibragem
        if (dados.calibragem) {
          progresso += 7.5; // Atualizando o progresso
          console.log(progresso);
          
          // Emitindo o progresso para o observable
          this.progressoSubject.next(progresso);
        }

        // Verifica se o movimento foi detectado
        if (dados.piscada) {
          console.log('Movimento detectado!');
          this.movimentoDetectado.emit();  // Emite o evento de movimento
        }
      };

      eventSource.onerror = (erro: Event) => {
        console.error('Erro na conexão com a rota:', erro);
        this._comunicacaoService.avisoErroConexao();
        this.isCalibrating = false;
        eventSource.close();
      };
    } catch (error) {
      // Captura qualquer erro que possa ocorrer fora do fluxo de eventos
      console.error('Erro ao iniciar o processo de calibragem:', error);
      this._comunicacaoService.avisoErroConexao();
      this.isCalibrating = false;
    }
  }

  // Método para acessar o progresso, caso queira usar o Subject de forma reativa
  getProgresso() {
    return this.progressoSubject.asObservable();
  }
}

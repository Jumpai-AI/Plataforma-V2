import { inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ManutencaoComponent } from "../componentes/modais/manutencao/manutencao.component";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoService {

  private dialog = inject(MatDialog);

  // Declarando o tipo correto para dialogManutencaoRef
  private dialogManutencaoRef: MatDialogRef<ManutencaoComponent> | null = null;

  // Função que abre o modal de manutenção e o fecha após 3 segundos
  avisoManutencao(): void {
    // Abre o modal e atribui o valor à variável dialogManutencaoRef
    this.dialogManutencaoRef = this.dialog.open(ManutencaoComponent);
    
    setTimeout(() => {
      // Verifica se o modal está aberto e fecha após 3 segundos
      if (this.dialogManutencaoRef) {
        this.dialogManutencaoRef.close();
      }
    }, 3000);
  }

}

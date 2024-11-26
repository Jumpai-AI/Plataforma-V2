import { inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ManutencaoComponent } from "../componentes/modais/manutencao/manutencao.component";
import { SemConexaoComponent } from "../componentes/modais/sem-conexao/sem-conexao.component";

@Injectable({
  providedIn: 'root'
})
export class ComunicacaoService {

  private dialog = inject(MatDialog);

  private dialogManutencaoRef: MatDialogRef<ManutencaoComponent> | null = null;
  private dialogSemConexaoRef: MatDialogRef<SemConexaoComponent> | null = null;


  avisoManutencao(): void {
    this.dialogManutencaoRef = this.dialog.open(ManutencaoComponent);
    
    setTimeout(() => {
      if (this.dialogManutencaoRef) {
        this.dialogManutencaoRef.close();
      }
    }, 3000);
  }

  avisoErroConexao(): void {
    this.dialogSemConexaoRef = this.dialog.open(SemConexaoComponent);
    
    setTimeout(() => {
      if (this.dialogSemConexaoRef) {
        this.dialogSemConexaoRef.close();
      }
    }, 3000);
  }

}

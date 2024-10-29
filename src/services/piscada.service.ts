import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlinkService {
  private faceMesh: any;
  private camera: any;

  alturasRegistradas: number[] = [];
  mediaAltura: number | 0 = 0; 
  piscadaRegistrada = false;
  public piscadaDetectada = new EventEmitter<void>();
  private multiFaceLandmarks: any[] | null = null; // Propriedade para armazenar landmarks

  constructor() {}

  public async initializeFaceMesh(videoElement: HTMLVideoElement): Promise<void> {
    if (this.faceMesh) {
      // Se já houver uma instância, pare a câmera
      this.camera.stop();
      this.faceMesh.close();
    }
  
    const FaceMesh = (window as any).FaceMesh;
  
    if (!FaceMesh) {
      console.error("FaceMesh não está disponível. Verifique o carregamento do script.");
      return;
    }
  
    this.faceMesh = new FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
  
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.8
    });
  
    // Inicializa a câmera aqui
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  
    this.camera = new (window as any).Camera(videoElement, {
      onFrame: async () => {
        await this.faceMesh.send({ image: videoElement });
      }
    });
  
    this.camera.start();
  
    // Registra callback para processar resultados
    this.faceMesh.onResults((results: any) => {
      if (results && results.multiFaceLandmarks) {
        this.multiFaceLandmarks = results.multiFaceLandmarks; // Armazena os resultados globalmente
      } else {
        console.warn('Resultados não encontrados ou vazios:', results);
      }
    });
  }
  

  public async registrarAlturasDosOlhos(videoElement: HTMLVideoElement): Promise<void> {
    const tempoLimite = 8000; 
    const intervalo = 150; 
    
    const inicio = Date.now();
    await this.initializeFaceMesh(videoElement);
    
    while ((Date.now() - inicio) < tempoLimite) {
      await new Promise(resolve => setTimeout(resolve, intervalo));
    }

    // Processa os landmarks armazenados
    if (this.multiFaceLandmarks) {
      for (const landmarks of this.multiFaceLandmarks) {
        const currentEyeHeight = this.calcularTamanhoOlho(landmarks);
        if (currentEyeHeight) {
          this.alturasRegistradas.push(currentEyeHeight);
        }
      }
    }
    
    const soma = this.alturasRegistradas.reduce((acc, altura) => acc + altura, 0);
    const mediaCalculada = (this.alturasRegistradas.length > 0 ? soma / this.alturasRegistradas.length : 0) / 3;
    console.log('mediaCalculada',mediaCalculada)

    // Formata a média para duas casas decimais
    this.mediaAltura = parseFloat(mediaCalculada.toFixed(3));
  }

  public async iniciarTestePiscadas(videoElement: HTMLVideoElement): Promise<void> {
    const tempoTeste = 3000; 
    const numeroDeTestes = 3; 
    let piscadasContadasTotal = 0;
  
    for (let testeAtual = 0; testeAtual < numeroDeTestes; testeAtual++) {
      let piscadasContadas = 0; 
      
      await new Promise<void>((resolve) => {
        const intervalo = setInterval(() => {
          if (this.multiFaceLandmarks) {
            for (const landmarks of this.multiFaceLandmarks) {
              const alturaAtual = this.calcularTamanhoOlho(landmarks);
              console.log('alturaAtual',alturaAtual)
              if (alturaAtual && this.detectBlink(alturaAtual)) {
                piscadasContadas++;
              }
            }
          }
        }, 100); 
  
        setTimeout(() => {
          clearInterval(intervalo);
          piscadasContadasTotal += piscadasContadas; 
          resolve();
        }, tempoTeste);
      });
    }
  
    if (piscadasContadasTotal < numeroDeTestes) {
      throw new Error(`Erro na calibragem: apenas ${piscadasContadasTotal} piscadas registradas.`);
    }
  
    console.log('Sucesso! Duas ou mais piscadas registradas em cada teste.', piscadasContadasTotal);
  }
    

  private calcularTamanhoOlho(landmarks: any[]): number | null {
    if (!landmarks || landmarks.length === 0) {
      return null; 
    }

    const leftEyeTop = landmarks[159]; 
    const leftEyeBottom = landmarks[145]; 

    const leftEyeTopY = leftEyeTop.y; 
    const leftEyeBottomY = leftEyeBottom.y; 

    return leftEyeBottomY - leftEyeTopY; 
  }

  public detectBlink(currentEyeHeight: number): boolean {
    if (currentEyeHeight < this.mediaAltura && !this.piscadaRegistrada) {
      this.piscadaRegistrada = true;
      this.piscadaDetectada.emit();
      return true;
    }

    if (currentEyeHeight >= this.mediaAltura && this.piscadaRegistrada) {
      this.piscadaRegistrada = false;
    }

    return false;
  }
}

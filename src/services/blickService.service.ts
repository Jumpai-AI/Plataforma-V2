import { EventEmitter, Injectable } from '@angular/core';
import { ControleService } from './controle.service';  // Importando o serviço ControleService

@Injectable({
  providedIn: 'root'
})
export class BlinkService {

  private faceMesh: any;
  private camera: any;

  blinkDetected: EventEmitter<void> = new EventEmitter<void>();
  private blinkRegistered: boolean = false;

  constructor() {}

  private blinkFramesCount = 0; // Contador para frames consecutivos abaixo da calibragem

  public detectBlink(currentEyeHeight: number): boolean {
    const valorMedioCalibragem = ControleService.valorMedioCalibragem;
  
    // Verifica se a altura dos olhos está abaixo do valor de calibragem
    if (currentEyeHeight < valorMedioCalibragem) {
      this.blinkFramesCount++; // Aumenta o contador
  
      // Registra a piscada somente depois de 3 frames consecutivos
      if (this.blinkFramesCount >= 3 && !this.blinkRegistered) {
        this.blinkRegistered = true;
        this.blinkDetected.emit(); // Emite a detecção de blink de forma síncrona
        return true;
      }
    } else {
      // Reseta o contador se os olhos voltam a um valor acima da calibragem
      this.blinkFramesCount = 0;
  
      // Reseta o status de piscada registrada
      if (this.blinkRegistered) {
        this.blinkRegistered = false;
      }
    }
  
    return false;
  }
  
  

  public async initializeFaceMesh(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
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

    this.faceMesh.onResults((results: any) => this.onResults(results, canvasElement));


    // Certifique-se de não bloquear a renderização esperando aqui
    try {
      await this.setupCamera(videoElement, canvasElement);
    } catch (error) {
      console.error("Erro ao configurar a câmera:", error);
      return;
    }
    
    this.camera.start();  // Inicia a câmera

    // Deixe o componente continuar renderizando enquanto isso ocorre
    setTimeout(() => {
      console.log("Câmera e FaceMesh iniciados");
    }, 0);
  }


  private async setupCamera(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;

    console.log("Câmera configurada e iniciada.");

    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    canvasElement.style.objectFit = 'cover';

    this.camera = new (window as any).Camera(videoElement, {
      onFrame: async () => {
        await this.faceMesh.send({ image: videoElement });
      }
    });
  }

  private onResults(results: any, canvasElement: HTMLCanvasElement): void {
    if (!canvasElement) {
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) {
      console.error("Não foi possível obter o contexto 2D do canvas.");
      return;
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Inverte a imagem horizontalmente
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    
    // Desenha a imagem invertida
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        this.processEye(landmarks, canvasElement.height);
      
        // Olho esquerdo
        const leftEyeTop = landmarks[159];
        const leftEyeBottom = landmarks[145];
        canvasCtx.beginPath();
        canvasCtx.moveTo(leftEyeTop.x * canvasElement.width, leftEyeTop.y * canvasElement.height);
        canvasCtx.lineTo(leftEyeBottom.x * canvasElement.width, leftEyeBottom.y * canvasElement.height);
        canvasCtx.strokeStyle = 'yellow';
        canvasCtx.lineWidth = 1.25;
        canvasCtx.stroke();
      
        // Olho direito
        const rightEyeTop = landmarks[386];
        const rightEyeBottom = landmarks[374];  
        canvasCtx.beginPath();
        canvasCtx.moveTo(rightEyeTop.x * canvasElement.width, rightEyeTop.y * canvasElement.height);
        canvasCtx.lineTo(rightEyeBottom.x * canvasElement.width, rightEyeBottom.y * canvasElement.height);
        canvasCtx.strokeStyle = 'yellow';
        canvasCtx.lineWidth = 1.25;
        canvasCtx.stroke();
      }
    }

    canvasCtx.restore();
  }

  public stopCamera(videoElement: HTMLVideoElement): void {
    if (this.camera) {
      this.camera.stop();
      console.log("Câmera desligada.");
    }

    if (videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop()); 
      videoElement.srcObject = null; 
      console.log("Fluxo de vídeo interrompido e elemento de vídeo limpo.");
    }
  }

  public processEye(landmarks: any[], canvasHeight: number): void {
    const leftEyeTop = landmarks[159]; 
    const leftEyeBottom = landmarks[145]; 

    const leftEyeTopY = leftEyeTop.y; 
    const leftEyeBottomY = leftEyeBottom.y; 

    this.detectBlink(leftEyeBottomY - leftEyeTopY); 
  }

  
}

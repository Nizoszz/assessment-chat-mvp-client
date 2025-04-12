import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { MessageBubbleComponent } from '../components/message-bubble/message-bubble.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/api-client/chat.service';

export interface FileData {
  name: string;
  type: 'pdf' | 'txt' | null;
  size: number;
  url?: string;
  file: File;
}

export interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  file?: FileData | null;
}

export interface Payload {
  resume: FileData | null;
  jobText: string | null;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ChatInputComponent, MessageBubbleComponent, CommonModule],
  providers: [ChatService],
})
export class ChatComponent implements AfterViewInit {
  constructor(private chatService: ChatService) {}
  messages: Message[] = [];
  isProcessing = false;
  resumeFile: FileData | null = null;
  jobDescriptionText: string | null = null;
  payload: Payload = {
    resume: null,
    jobText: null,
  };
  @ViewChild('messagesEnd') private messagesEndRef!: ElementRef;

  ngAfterViewInit(): void {
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    if (this.messages.length === 0) {
      this.messages.push({
        type: 'ai',
        content: `Olá! 👋 Eu sou o MatchWise Bot, seu assistente inteligente de currículos.

📄 Envie seu currículo em PDF ou cole o texto diretamente aqui.

🎯 Depois, envie a descrição da vaga que deseja se candidatar.

Com isso, vou analisar o match entre o seu perfil e a vaga, e sugerir melhorias se necessário. 😉

Vamos começar?`,
        timestamp: new Date(),
      });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEndRef?.nativeElement?.scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  onSendMessage(content: string, file: FileData | null) {
    const userMessage: Message = {
      type: 'user',
      content,
      timestamp: new Date(),
      file: file ?? null,
    };

    this.messages.push(userMessage);
    this.isProcessing = true;
    this.scrollToBottom();
    if (file != null && (file.type === 'pdf' || file.type === 'txt')) {
      this.resumeFile = file;
      this.payload['resume'] = file;
    }
    if (!file && content && content.length > 30) {
      this.jobDescriptionText = content;
      this.payload['jobText'] = content;
    }

    setTimeout(() => {
      let responseText = '';
      if (!file && !content) {
        responseText =
          'Por favor, envie uma mensagem ou arquivo para que eu possa ajudar.';
        this.isProcessing = true;
      } else if (file && !this.jobDescriptionText) {
        responseText = `📄 Recebi o currículo: ${file.name}. Agora envie a descrição da vaga para continuar.`;
        this.isProcessing = true;
      } else if (content.length > 100 && !file && !this.resumeFile) {
        responseText = `📝 Recebi a descrição da vaga. Agora envie seu currículo em PDF ou TXT para continuar.`;
        this.isProcessing = true;
      } else if (this.resumeFile && this.jobDescriptionText) {
        responseText = `✅ Recebi o currículo e a descrição da vaga. Iniciando a análise...`;
        this.isProcessing = true;
        this.chatService
          .analyse({
            resume: this.resumeFile,
            jobText: this.jobDescriptionText,
          })
          .subscribe((response: AnalyseResultResponseDto) => {
            responseText = `
📊 Análise de currículo concluída!
🔢 Score de compatibilidade: ${response.matchScore}%
📌 Classificação: ${response.classification}
✅ Pontos fortes:
${response.strongPoints.map((p, i) => `  ${i + 1}. ${p}`).join('\n')}
⚠️ Pontos a melhorar:
${response.pointsToImprove
  .map((p, i) => `  ${i + 1}. ${p.description} → \n${p.studyRecommendation}`)
  .join('\n')}
📝 Sugestões para o currículo:
${response.resumeSuggestions.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
📅 Análise realizada em: ${response.createdAt}
`.trim();
            const aiResponse: Message = {
              type: 'ai',
              content: responseText,
              timestamp: new Date(),
            };

            this.messages.push(aiResponse);
            this.isProcessing = false;
            this.scrollToBottom();
          });
      } else {
        responseText = `Olá! Sou o assistente MatchWise. Para continuar com a análise, por favor envie um currículo válido (PDF ou TXT) e a descrição da vaga que deseja avaliar.`;
        this.isProcessing = true;
      }
      const aiResponse: Message = {
        type: 'ai',
        content: responseText,
        timestamp: new Date(),
      };

      this.messages.push(aiResponse);
      this.isProcessing = false;
      this.scrollToBottom();
    }, 1500);
  }
}
export interface AnalyseResultResponseDto {
  classification: string;
  strongPoints: string[];
  pointsToImprove: PointToImprove[];
  resumeSuggestions: string[];
  matchScore: string;
  createdAt: string;
}

export interface PointToImprove {
  description: string;
  studyRecommendation: string;
}

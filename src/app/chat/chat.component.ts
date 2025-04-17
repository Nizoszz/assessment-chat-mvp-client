import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { MessageBubbleComponent } from '../components/message-bubble/message-bubble.component';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/api-client/chat.service';
import { AnalyseResultResponseDto } from '../services/api-client/chat.models';
import { FileData, Message, Payload } from './chat.model';

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

📄 Envie seu currículo em PDF e a descrição da vaga que deseja se candidatar.

💡 Você pode enviar ambos juntos ou um de cada vez, como preferir!

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
    const contentSanitize = content.replace(/\n\s*\n/g, '\n');
    const userMessage: Message = {
      type: 'user',
      content:contentSanitize,
      timestamp: new Date(),
      file: file ?? null,
    };

    this.messages.push(userMessage);
    this.scrollToBottom();

    this.updatePayload(content, file);

    this.isProcessing = true;

    setTimeout(() => {
      const hasResume = file && file.type === 'pdf';
      const isJobDescription = content;

      const bothPresentNow = hasResume && isJobDescription;
      if (bothPresentNow) {
        this.processAnalysis();
        return;
      }

      if (this.resumeFile && this.jobDescriptionText) {
        this.processAnalysis();
      } else {
        const responseText = this.getBotResponse(content, file);
        this.pushAiMessage(responseText);
        this.isProcessing = false;
      }
    }, 1500);
  }

  private updatePayload(content: string, file: FileData | null) {
    if (file && file.type === 'pdf') {
      this.resumeFile = file;
      this.payload.resume = file;
    }

    if (content) {
      this.jobDescriptionText = content;
      this.payload.jobText = content;
    }
  }

  private getBotResponse(content: string, file: FileData | null): string {
    if (!file && !content) {
      return 'Por favor, envie uma mensagem ou arquivo para que eu possa ajudar.';
    }

    if (file && !this.jobDescriptionText) {
      return `📄 Recebi o currículo: ${file.name}. Agora envie a descrição da vaga para continuar.`;
    }

    if (content.length > 100 && !file && !this.resumeFile) {
      return `📝 Recebi a descrição da vaga. Agora envie seu currículo em PDF para continuar.`;
    }

    if (!this.resumeFile || !this.jobDescriptionText) {
      return `Olá! Sou o assistente MatchWise. Para continuar com a análise, por favor envie um currículo válido (PDF) e a descrição da vaga que deseja avaliar.`;
    }
    return `✅ Recebi o currículo e a descrição da vaga. Iniciando a análise...`;
  }

  private processAnalysis() {
    if (this.resumeFile && this.jobDescriptionText) {
      this.chatService
        .analyse({
          resume: this.resumeFile!,
          jobText: this.jobDescriptionText!,
        })
        .subscribe((response: AnalyseResultResponseDto) => {
          const responseText = this.formatAnalysis(response);
          for (const msg of responseText) {
            this.pushAiMessage(msg);
          }
          this.isProcessing = false;
          this.scrollToBottom();
          this.clearPayload();
        });
    }
  }

  private formatAnalysis(
    response: AnalyseResultResponseDto
  ): string[] | string {
    if (!response) {
      return 'Desculpe, não consegui processar a análise. Por favor, tente novamente.';
    }
    const userFeedback = `
    <h2 class="text-xl font-bold">📊 Análise de currículo concluída!</h2>
    <h3 class="text-base font-semibold">🔢 Score de compatibilidade: ${
      response.matchScore
    }%</h3>
    <div class="flex flex-col">
      <h3 class="text-base font-semibold">✅ Pontos fortes:</h3>
      <ul class="flex flex-col gap-1 ml-4 list-disc">${response.strongPoints
        .map((p) => `<li class="ml-4 text-sm">${p}</li>`)
        .join('')}
      </ul>
    </div>
    <div class="flex flex-col">
      <h3 class="text-base font-semibold">⚠️ Pontos a melhorar:</h3>
      <ul class="flex flex-col gap-2 ml-4 list-disc">${response.pointsToImprove
        .map(
          (p) =>
            `<li class="ml-4 text-sm">${p.description.trim()}:<ul class="list-disc list-inside flex flex-col gap-2 ml-0"><li class="flex gap-1 text-sm">${p.studyRecommendation
              .trim()
              .replace(/\s?\(https?:\/\/[^\s)]+\/?\)/, '')}</li></ul></li>`
        )
        .join('')}
      </ul>
    <div class="flex flex-col">
      <h3 class="text-base font-semibold">📝 Sugestões para o currículo:</h3>
      <ul class="flex flex-col gap-2 ml-4 list-disc">
        ${response.resumeSuggestions
          .map((s) => `<li class="ml-4 text-sm">${s}</li>`)
          .join('')}
      </ul>
    </div>
    <p>📅 <strong>Análise realizada em:</strong> ${response.createdAt}</p>
    `.trim();
    const recruiterView = `
      <h2 class="text-xl font-bold">👀 Visão do Recrutador</h2>
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold">✅ Alinhamento</h3>
        <p class="ml-1 text-sm">${response.recruiterView.alignmentView
          .replace(/[\*\-]/g, '')
          .replace(/\n+/g, '\n')
          .replace(/\+\s*'\\n'\s*/, '')
          .trim()}</p>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold">❌ Desalinhamento</h3>
        <p class="ml-1 text-sm">${response.recruiterView.misalignmentView
          .replace(/[\*\-]/g, '')
          .replace(/\n+/g, '\n')
          .replace(/\+\s*'\\n'\s*/, '')
          .trim()}</p>
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold">⚠️ Pontos de Atenção</h3>
        <p class="ml-1 text-sm">${response.recruiterView.attentionView
          .replace(/[\*\-]/g, '')
          .replace(/\n+/g, '\n')
          .replace(/\+\s*'\\n'\s*/, '')
          .trim()}</p>
      </div>
    `.trim();
    return [userFeedback, recruiterView];
  }

  private pushAiMessage(content: string) {
    this.messages.push({
      type: 'ai',
      content,
      timestamp: new Date(),
    });
    this.scrollToBottom();
  }

  private clearPayload() {
    this.resumeFile = null;
    this.jobDescriptionText = null;
    this.payload.resume = null;
    this.payload.jobText = null;
  }
}

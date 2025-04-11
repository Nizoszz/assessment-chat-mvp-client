import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { MessageBubbleComponent } from '../components/message-bubble/message-bubble.component';
import { CommonModule } from '@angular/common';

export interface FileData {
  name: string;
  type: 'pdf' | 'txt' | null;
  size: number;
  url?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  files?: FileData[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [ChatInputComponent, MessageBubbleComponent, CommonModule],
})
export class ChatComponent implements AfterViewInit {
  messages: Message[] = [];
  isProcessing = false;
  @ViewChild('messagesEnd') private messagesEndRef!: ElementRef;

  ngAfterViewInit(): void {
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    if (this.messages.length === 0) {
      this.messages.push({
        id: uuidv4(),
        type: 'ai',
        content:
          'Olá! Sou seu assistente inteligente. Como posso ajudar hoje? Sinta-se à vontade para fazer perguntas ou enviar arquivos PDF ou TXT para análise.',
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

  onSendMessage(content: string, files: FileData[]) {
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content,
      timestamp: new Date(),
      files: files.length ? files : undefined,
    };

    this.messages.push(userMessage);
    this.isProcessing = true;
    this.scrollToBottom();

    setTimeout(() => {
      let responseText = 'Obrigado pela sua mensagem. ';
      if (content) responseText += 'Entendi o que você disse. ';
      if (files.length > 0) {
        responseText += `Recebi ${files.length} arquivo(s): ${files
          .map((f) => f.name)
          .join(
            ', '
          )}. Em uma aplicação real, eu analisaria o conteúdo destes arquivos.`;
      } else if (!content) {
        responseText =
          'Por favor, envie uma mensagem ou arquivo para que eu possa ajudar.';
      }

      const aiResponse: Message = {
        id: uuidv4(),
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

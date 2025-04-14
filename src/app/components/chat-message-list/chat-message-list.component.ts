import {
  Component,
  Input,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { CommonModule } from '@angular/common';
import { Message } from '../../chat/chat.component';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.css'],
  imports: [MessageBubbleComponent, CommonModule],
})
export class ChatMessageListComponent implements AfterViewChecked {

  @Input() messages: Message[] = [];
  @ViewChild('endOfMessages') endOfMessages!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.endOfMessages?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }
}

import {
  Component,
  Input,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { CommonModule } from '@angular/common';
// import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat-message-list',
  templateUrl: './chat-message-list.component.html',
  styleUrls: ['./chat-message-list.component.css'],
  imports: [MessageBubbleComponent, CommonModule],
})
export class ChatMessageListComponent implements AfterViewChecked {
  // message: any; // replace 'any' with your message model
  @Input() messages: any[] = [];
  @ViewChild('endOfMessages') endOfMessages!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.endOfMessages?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }
}

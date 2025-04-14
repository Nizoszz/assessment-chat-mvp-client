import { Component, Input } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../../chat/chat.component';
import { FileIconComponent } from '../file-icon/file-icon.component';
import { CommonModule } from '@angular/common';
import { MessageIconComponent } from "../message-icon/message-icon.component";
@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css'],
  imports: [FileIconComponent, CommonModule, MessageIconComponent],
})
export class MessageBubbleComponent {
  @Input() message!: Message;

  get isUser(): boolean {
    return this.message.type === 'user';
  }

  formatTime(timestamp: Date): string {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
}

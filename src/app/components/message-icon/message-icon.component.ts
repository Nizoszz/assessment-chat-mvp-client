import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-icon',
  standalone: true,
  templateUrl: './message-icon.component.html',
  imports: [CommonModule],
})
export class MessageIconComponent {
  @Input() type: 'user' | 'ai' = 'user';
  @Input() className = '';
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadButtonComponent } from '../file-upload-button/file-upload-button.component';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FileData } from '../../chat/chat.model';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  imports: [FileUploadButtonComponent, FormsModule, NgClass],
})
export class ChatInputComponent {
  @Output() sendMessage = new EventEmitter<{
    message: string;
    file: FileData | null;
  }>();
  message: string = '';
  selectedFile: FileData | null = null;
  @Input() isProcessing = false;

  onSubmit(event: Event): void {
    event.preventDefault();

    const trimmedMessage = this.message.trim();
    if (!trimmedMessage && !this.selectedFile) return;

    this.sendMessage.emit({
      message: trimmedMessage,
      file: this.selectedFile,
    });

    this.message = '';
    this.selectedFile = null;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit(event);
    }
  }

  onFileSelected(file: FileData | null): void {
    this.selectedFile = file;
  }
}

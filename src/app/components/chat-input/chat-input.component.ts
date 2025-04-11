import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadButtonComponent } from '../file-upload-button/file-upload-button.component';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FileData } from '../../chat/chat.component';
// import { FileData } from '../models/file-data.model';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
  imports: [FileUploadButtonComponent, FormsModule, NgClass],
})
export class ChatInputComponent {
  // Assuming FileData is a model, change any to filedata
  @Output() sendMessage = new EventEmitter<{
    message: string;
    files: FileData[];
  }>();
  message: string = '';
  selectedFiles: FileData[] = [];
  @Input() isProcessing = false;

  onSubmit(event: Event): void {
    event.preventDefault();

    const trimmedMessage = this.message.trim();
    if (!trimmedMessage && this.selectedFiles.length === 0) return;

    this.sendMessage.emit({
      message: trimmedMessage,
      files: this.selectedFiles,
    });

    this.message = '';
    this.selectedFiles = [];
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSubmit(event);
    }
  }

  onFilesSelected(files: FileData[]): void {
    this.selectedFiles = files;
  }
}

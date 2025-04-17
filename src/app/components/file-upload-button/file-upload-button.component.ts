import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileIconComponent } from '../file-icon/file-icon.component';
import { CommonModule } from '@angular/common';
import { FileData } from '../../chat/chat.model';
@Component({
  standalone: true,
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.css'],
  imports: [FileIconComponent, CommonModule],
})
export class FileUploadButtonComponent {
  @Input() selectedFile: FileData | null = null;
  @Output() fileSelect = new EventEmitter<FileData | null>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(private toastr: ToastrService) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      const fileData: FileData = {
        name: file.name,
        type: 'pdf',
        size: file.size,
        url: URL.createObjectURL(file),
        file: file,
      };
      this.fileSelect.emit(fileData);
    } else {
      this.toastr.error('Only PDF files are supported');
    }
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  removeFile(): void {
    this.fileSelect.emit(null);
  }

  triggerFilePicker(): void {
    this.fileInputRef.nativeElement.click();
  }
}

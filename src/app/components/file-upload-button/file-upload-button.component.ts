import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
// import { any } from '../types/message-types';
import { ToastrService } from 'ngx-toastr';
import { FileIconComponent } from '../file-icon/file-icon.component';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-file-upload-button',
  templateUrl: './file-upload-button.component.html',
  styleUrls: ['./file-upload-button.component.css'],
  imports: [FileIconComponent, CommonModule],
})
export class FileUploadButtonComponent {
  @Input() selectedFiles: any[] = [];
  @Output() filesSelect = new EventEmitter<any[]>();
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(private toastr: ToastrService) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fileList = target.files;
    if (!fileList) return;

    const newFiles: any[] = [];
    let hasInvalidFile = false;

    Array.from(fileList).forEach((file) => {
      if (file.type === 'application/pdf' || file.type === 'text/plain') {
        const fileType = file.type === 'application/pdf' ? 'pdf' : 'txt';
        newFiles.push({
          name: file.name,
          type: fileType,
          size: file.size,
          url: URL.createObjectURL(file),
        });
      } else {
        hasInvalidFile = true;
      }
    });

    if (hasInvalidFile) {
      this.toastr.error('Only PDF and TXT files are supported');
    }

    if (newFiles.length > 0) {
      this.filesSelect.emit([...this.selectedFiles, ...newFiles]);
    }

    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  removeFile(index: number): void {
    const updatedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.filesSelect.emit(updatedFiles);
  }

  triggerFilePicker(): void {
    this.fileInputRef.nativeElement.click();
  }
}

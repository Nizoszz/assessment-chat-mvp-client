import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-icon',
  standalone: true,
  templateUrl: './file-icon.component.html',
  imports: [CommonModule],
})
export class FileIconComponent {
  @Input() type: 'pdf'| null = null;
  @Input() className: string = 'h-4 w-4';
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { FileData } from '../../chat/chat.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = environment.apiUrl;
  constructor(private readonly http: HttpClient) {}
  analyse(request: { resume: FileData; jobText: string }): Observable<any> {
    const formData = new FormData();
    formData.append('jobDescription', request.jobText);
    formData.append('file', request.resume.file, request.resume.file.name);
    return this.http.post<any>(
      `${this.baseUrl}chat/matching-analysis`,
      formData
    );
  }
}

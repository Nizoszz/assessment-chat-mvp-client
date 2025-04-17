export interface FileData {
  name: string;
  type: 'pdf' | null;
  size: number;
  url?: string;
  file: File;
}

export interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  file?: FileData | null;
}

export interface Payload {
  resume: FileData | null;
  jobText: string | null;
}

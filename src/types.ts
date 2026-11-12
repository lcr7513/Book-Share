export interface TrackedFile {
  id: string;
  name: string;
  driveUrl: string;
  driveFileId: string;
  category: 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'archive' | 'other';
  size: string;
  downloadCount: number;
  createdAt: string;
  lastDownloadedAt?: string;
  description?: string;
  customTargetUrl?: string;
}

export interface DownloadLog {
  id: string;
  fileId: string;
  fileName: string;
  timestamp: string;
  referrer: string;
  device: string;
  ip: string;
  status: 'success' | 'redirected';
}

export type ActiveTab = 'diagnostic' | 'simulator' | 'appsScript' | 'workspace' | 'developer' | 'comparison';

import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent Data Storage Path
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface TrackedFile {
  id: string;
  name: string;
  driveUrl: string;
  driveFileId: string;
  category: string;
  size: string;
  downloadCount: number;
  createdAt: string;
  lastDownloadedAt?: string;
  description?: string;
  customTargetUrl?: string;
}

interface DownloadLog {
  id: string;
  fileId: string;
  fileName: string;
  timestamp: string;
  referrer: string;
  device: string;
  ip: string;
  status: 'success' | 'redirected';
}

interface StorageSchema {
  files: TrackedFile[];
  logs: DownloadLog[];
}

const INITIAL_STORE: StorageSchema = {
  files: [
    {
      id: 'file-ai-inquiry',
      name: 'AI를_활용한_사회문제탐구.pdf',
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing',
      driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      category: 'pdf',
      size: '4.2 MB',
      downloadCount: 15,
      createdAt: '2026-11-11 10:00:00',
      lastDownloadedAt: '2026-11-11 21:50:12',
      description: '인공지능을 활용한 사회문제 해결 탐구 학습 자료 및 학생 과제 양식',
    },
    {
      id: 'file-1',
      name: '2026학년도_학교_교육과정_운영계획_및_학사일정.pdf',
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing',
      driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      category: 'pdf',
      size: '3.4 MB',
      downloadCount: 42,
      createdAt: '2026-11-01 09:30:00',
      lastDownloadedAt: '2026-11-11 14:22:15',
      description: '학부모 및 교직원용 학사일정 및 연간 교육 계획 안내 문서',
    },
    {
      id: 'file-2',
      name: '학생_개인정보_수집이용_및_초상권_활용_동의서.docx',
      driveUrl: 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j_sample_consent_doc/view',
      driveFileId: '1a2b3c4d5e6f7g8h9i0j_sample_consent_doc',
      category: 'doc',
      size: '480 KB',
      downloadCount: 28,
      createdAt: '2026-11-03 11:15:00',
      lastDownloadedAt: '2026-11-11 16:05:40',
      description: '신학기 학생 학적용 공식 서약서 양식',
    },
    {
      id: 'file-3',
      name: '신학기_학교폭력_예방_및_교통안전수칙_카드뉴스.png',
      driveUrl: 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms_img/view',
      driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms_img',
      category: 'image',
      size: '1.2 MB',
      downloadCount: 65,
      createdAt: '2026-11-05 13:40:00',
      lastDownloadedAt: '2026-11-11 18:45:10',
      description: '학생 및 학부모 알림장 배포용 인포그래픽',
    },
  ],
  logs: [
    {
      id: 'log-ai-1',
      fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      fileName: 'AI를_활용한_사회문제탐구.pdf',
      timestamp: '2026-11-11 21:50:12',
      referrer: 'https://school.ice.go.kr',
      device: 'Desktop (Chrome)',
      ip: '211.234.***.***',
      status: 'success',
    },
    {
      id: 'log-101',
      fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms_img',
      fileName: '신학기_학교폭력_예방_및_교통안전수칙_카드뉴스.png',
      timestamp: '2026-11-11 18:45:10',
      referrer: 'https://school.ice.go.kr',
      device: 'Mobile (Android / Chrome)',
      ip: '211.234.***.***',
      status: 'success',
    },
  ],
};

function readStore(): StorageSchema {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading store:', err);
  }
  // Initialize with seed data
  writeStore(INITIAL_STORE);
  return INITIAL_STORE;
}

function writeStore(data: StorageSchema): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store:', err);
  }
}

// Ensure initial store exists
readStore();

function getDirectUrl(fileId: string, driveUrl: string = ''): string {
  if (driveUrl.includes('docs.google.com/document')) {
    return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  }
  if (driveUrl.includes('docs.google.com/presentation')) {
    return `https://docs.google.com/presentation/d/${fileId}/export?format=pptx`;
  }
  if (driveUrl.includes('docs.google.com/spreadsheets')) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
  }
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
}

// -------------------------------------------------------------
// REST API Routes (Persistent Storage)
// -------------------------------------------------------------

// 1. GET all tracked files
app.get('/api/files', (_req: Request, res: Response) => {
  const store = readStore();
  res.json({ success: true, files: store.files });
});

// 2. POST create new tracked file
app.post('/api/files', (req: Request, res: Response) => {
  const { name, driveUrl, driveFileId, category, size, description } = req.body;
  if (!driveFileId || !name) {
    return res.status(400).json({ success: false, message: '파일명과 파일 ID는 필수입니다.' });
  }

  const store = readStore();
  const nowStr = new Date().toLocaleString('ko-KR', { hour12: false });

  const newFile: TrackedFile = {
    id: `file-${Date.now()}`,
    name,
    driveUrl: driveUrl || '',
    driveFileId,
    category: category || 'pdf',
    size: size || '2.0 MB',
    downloadCount: 0,
    createdAt: nowStr,
    description: description || '영구 저장된 추적 파일',
  };

  store.files.unshift(newFile);
  writeStore(store);

  res.json({ success: true, file: newFile });
});

// 3. DELETE a tracked file
app.delete('/api/files/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = readStore();
  store.files = store.files.filter((f) => f.id !== id && f.driveFileId !== id);
  writeStore(store);
  res.json({ success: true, message: '파일이 영구 삭제되었습니다.' });
});

// 4. POST record a download (increment count & log)
app.post('/api/download/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const store = readStore();
  const file = store.files.find((f) => f.id === id || f.driveFileId === id);

  if (!file) {
    return res.status(404).json({ success: false, message: '해당 파일을 찾을 수 없습니다.' });
  }

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  file.downloadCount += 1;
  file.lastDownloadedAt = timestamp;

  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const platform = isMobile ? 'Mobile' : 'Desktop';
  const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Whale') ? 'Whale' : 'Browser';

  const newLog: DownloadLog = {
    id: `log-${Date.now()}`,
    fileId: file.driveFileId,
    fileName: file.name,
    timestamp,
    referrer: (req.headers.referer as string) || '웹 앱 다운로드 버튼',
    device: `${platform} (${browser})`,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '203.241.***.***',
    status: 'success',
  };

  store.logs.unshift(newLog);
  writeStore(store);

  const directUrl = getDirectUrl(file.driveFileId, file.driveUrl);
  res.json({ success: true, file, directUrl });
});

// 5. GET direct proxy stream/download link (Student direct link with UTF-8 filename preservation)
// e.g. /api/download/:fileId/direct
app.get('/api/download/:fileId/direct', async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const store = readStore();
  const file = store.files.find((f) => f.driveFileId === fileId || f.id === fileId);

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  let fileName = file ? file.name : `파일_${fileId}.pdf`;
  if (!fileName.includes('.')) {
    fileName = `${fileName}.pdf`;
  }

  if (file) {
    file.downloadCount += 1;
    file.lastDownloadedAt = timestamp;
  }

  const newLog: DownloadLog = {
    id: `log-${Date.now()}`,
    fileId: file ? file.driveFileId : fileId,
    fileName,
    timestamp,
    referrer: (req.headers.referer as string) || '학생 직접 다운로드 링크',
    device: 'Direct Stream Click',
    ip: (req.headers['x-forwarded-for'] as string) || '203.241.***.***',
    status: 'success',
  };

  store.logs.unshift(newLog);
  writeStore(store);

  const directUrl = getDirectUrl(file ? file.driveFileId : fileId, file ? file.driveUrl : '');

  try {
    const upstream = await fetch(directUrl);
    if (upstream.ok && upstream.body) {
      const encodedFilename = encodeURIComponent(fileName);
      res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/pdf');
      // RFC 5987 / RFC 6266 standard ensures Korean and middle dot (·) characters never get broken
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`
      );
      const cl = upstream.headers.get('content-length');
      if (cl) {
        res.setHeader('Content-Length', cl);
      }
      return Readable.fromWeb(upstream.body as any).pipe(res);
    }
  } catch (err) {
    console.error('Stream error, falling back to redirect:', err);
  }

  return res.redirect(directUrl);
});

// 6. GET logs
app.get('/api/logs', (_req: Request, res: Response) => {
  const store = readStore();
  res.json({ success: true, logs: store.logs });
});

// 7. DELETE logs
app.delete('/api/logs', (_req: Request, res: Response) => {
  const store = readStore();
  store.logs = [];
  writeStore(store);
  res.json({ success: true, message: '로그가 초기화되었습니다.' });
});

// -------------------------------------------------------------
// Vite Middleware / Static Serving
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TrackedFile, DownloadLog, ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { TrackerSimulator } from './components/TrackerSimulator';
import { AppsScriptGuide } from './components/AppsScriptGuide';
import { WorkspaceAuditGuide } from './components/WorkspaceAuditGuide';
import { DeveloperApiGuide } from './components/DeveloperApiGuide';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { ShareLandingModal } from './components/ShareLandingModal';
import { DiagnosticWizard } from './components/DiagnosticWizard';
import { QrCodeModal } from './components/QrCodeModal';
import { StudentDownloadView } from './components/StudentDownloadView';
import { CheckCircle2, HeartHandshake } from 'lucide-react';

// Initial Files
const INITIAL_FILES: TrackedFile[] = [
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
];

const INITIAL_LOGS: DownloadLog[] = [
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
  {
    id: 'log-102',
    fileId: '1a2b3c4d5e6f7g8h9i0j_sample_consent_doc',
    fileName: '학생_개인정보_수집이용_및_초상권_활용_동의서.docx',
    timestamp: '2026-11-11 16:05:40',
    referrer: 'https://mail.google.com',
    device: 'Desktop (Windows / Whale)',
    ip: '112.187.***.***',
    status: 'success',
  },
  {
    id: 'log-103',
    fileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    fileName: '2026학년도_학교_교육과정_운영계획_및_학사일정.pdf',
    timestamp: '2026-11-11 14:22:15',
    referrer: 'https://icedu.kr/portal',
    device: 'Desktop (macOS / Chrome)',
    ip: '175.223.***.***',
    status: 'success',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [files, setFiles] = useState<TrackedFile[]>(() => {
    const saved = localStorage.getItem('gdrive_tracked_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_FILES;
      }
    }
    return INITIAL_FILES;
  });

  const [logs, setLogs] = useState<DownloadLog[]>(() => {
    const saved = localStorage.getItem('gdrive_download_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_LOGS;
      }
    }
    return INITIAL_LOGS;
  });

  const [previewFile, setPreviewFile] = useState<TrackedFile | null>(null);
  const [qrModalFile, setQrModalFile] = useState<TrackedFile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if visitor is opening student-only single download URL (e.g. ?file=...)
  const studentFileId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('file') : null;

  // 1. Initial fetch from backend persistent storage
  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.files) && data.files.length > 0) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.log('Static or local mode:', err));

    fetch('/api/logs')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch((err) => console.log('Static or local mode:', err));
  }, []);

  // Sync to local storage for local cache
  useEffect(() => {
    localStorage.setItem('gdrive_tracked_files', JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem('gdrive_download_logs', JSON.stringify(logs));
  }, [logs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add a new file to tracking (saved permanently to server)
  const handleAddFile = async (newFileData: Omit<TrackedFile, 'id' | 'downloadCount' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFileData),
      });
      const data = await res.json();
      if (data && data.success && data.file) {
        setFiles((prev) => [data.file, ...prev.filter((f) => f.id !== data.file.id)]);
        showToast(`'${data.file.name}' 파일이 영구 저장되었습니다.`);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Local fallback
    const nowStr = new Date().toLocaleString('ko-KR', { hour12: false });
    const newFile: TrackedFile = {
      ...newFileData,
      id: `file-${Date.now()}`,
      downloadCount: 0,
      createdAt: nowStr,
    };
    setFiles((prev) => [newFile, ...prev]);
    showToast(`'${newFile.name}' 파일이 저장되었습니다.`);
  };

  // Delete a tracked file (permanently from server)
  const handleDeleteFile = async (id: string) => {
    try {
      await fetch(`/api/files/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id && f.driveFileId !== id));
    showToast('파일이 영구 삭제되었습니다.');
  };

  // Record a download increment & append log (saved permanently to server)
  const handleRecordDownload = async (fileId: string) => {
    const targetFile = files.find((f) => f.id === fileId || f.driveFileId === fileId);
    if (!targetFile) return;

    try {
      const res = await fetch(`/api/download/${targetFile.id}`, { method: 'POST' });
      const data = await res.json();
      if (data && data.success && data.file) {
        setFiles((prev) => prev.map((f) => (f.id === targetFile.id ? data.file : f)));
        // Refresh logs from server
        fetch('/api/logs')
          .then((r) => r.json())
          .then((d) => {
            if (d.logs) setLogs(d.logs);
          });
        showToast(`다운로드 카운트 +1 (${targetFile.name}) [영구 저장 완료]`);
        return;
      }
    } catch (e) {
      console.error(e);
    }

    // Fallback
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId || f.driveFileId === fileId) {
          return {
            ...f,
            downloadCount: f.downloadCount + 1,
            lastDownloadedAt: timestamp,
          };
        }
        return f;
      })
    );

    const userAgent = navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const platform = isMobile ? 'Mobile' : 'Desktop';
    const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Safari') ? 'Safari' : 'Browser';

    const newLog: DownloadLog = {
      id: `log-${Date.now()}`,
      fileId: targetFile.driveFileId,
      fileName: targetFile.name,
      timestamp,
      referrer: document.referrer || '직접 방문 / 공유 링크',
      device: `${platform} (${browser})`,
      ip: '203.241.***.***',
      status: 'success',
    };

    setLogs((prev) => [newLog, ...prev]);
    showToast(`다운로드 카운트 +1 (${targetFile.name})`);
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs', { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
    setLogs([]);
    showToast('다운로드 로그 기록이 초기화되었습니다.');
  };

  const totalDownloads = files.reduce((acc, f) => acc + f.downloadCount, 0);

  // If student accesses isolated download page via ?file=...
  if (studentFileId) {
    const studentTarget = files.find((f) => f.id === studentFileId || f.driveFileId === studentFileId);
    if (studentTarget) {
      return <StudentDownloadView file={studentTarget} onRecordDownload={handleRecordDownload} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalDownloads={totalDownloads}
      />

      {/* Main Content Area */}
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'diagnostic' && <DiagnosticWizard />}

        {activeTab === 'simulator' && (
          <TrackerSimulator
            files={files}
            logs={logs}
            onAddFile={handleAddFile}
            onDeleteFile={handleDeleteFile}
            onRecordDownload={handleRecordDownload}
            onClearLogs={handleClearLogs}
            onPreviewLanding={(file) => setPreviewFile(file)}
            onOpenQrModal={(file) => setQrModalFile(file)}
          />
        )}

        {activeTab === 'appsScript' && <AppsScriptGuide />}

        {activeTab === 'workspace' && <WorkspaceAuditGuide />}

        {activeTab === 'developer' && <DeveloperApiGuide />}

        {activeTab === 'comparison' && (
          <ComparisonMatrix onSelectTab={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Modal for Visitor Landing Page Preview */}
      {previewFile && (
        <ShareLandingModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onRecordDownload={handleRecordDownload}
        />
      )}

      {/* Modal for QR Code & Student Share */}
      {qrModalFile && (
        <QrCodeModal
          file={qrModalFile}
          onClose={() => setQrModalFile(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-slate-600">
            <HeartHandshake className="w-4 h-4 text-blue-600" />
            <span>Google Drive 다운로드 트래킹 가이드 및 실시간 카운터 도구</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            구글 드라이브 파일 공유 &middot; Google Apps Script &middot; Google Workspace for Education
          </div>
        </div>
      </footer>
    </div>
  );
}

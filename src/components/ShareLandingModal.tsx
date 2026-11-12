import React, { useState, useEffect } from 'react';
import { TrackedFile } from '../types';
import { 
  X, 
  FileDown, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { getDirectDownloadUrl, getViewUrl } from '../utils/driveHelper';

interface ShareLandingModalProps {
  file: TrackedFile | null;
  onClose: () => void;
  onRecordDownload: (fileId: string) => void;
}

export const ShareLandingModal: React.FC<ShareLandingModalProps> = ({
  file,
  onClose,
  onRecordDownload,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [autoStarted, setAutoStarted] = useState<boolean>(false);
  const [downloadTriggered, setDownloadTriggered] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;

    setCountdown(3);
    setAutoStarted(false);
    setDownloadTriggered(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [file]);

  if (!file) return null;

  const triggerDownload = () => {
    if (downloadTriggered) return;
    setDownloadTriggered(true);
    setAutoStarted(true);
    onRecordDownload(file.id);

    // Open server direct download with RFC 6266 UTF-8 headers to prevent broken Korean filename
    const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const targetUrl = `${originUrl}/api/download/${file.id}/direct`;
    
    // Create temporary anchor to initiate download without closing current window
    const a = document.createElement('a');
    a.href = targetUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-medium text-slate-300">
              배포용 다운로드 페이지 미리보기 (방문자 시점)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6 text-center">
          {/* Badge Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
            <FileDown className="w-8 h-8 animate-bounce" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            파일 다운로드 준비 완료
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            다운로드 시 통계가 안전하게 집계된 후 전송이 시작됩니다.
          </p>

          {/* File Information Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                {file.category}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {file.size}
              </span>
            </div>
            <div className="font-semibold text-slate-900 text-base break-words mb-1">
              {file.name}
            </div>
            {file.description && (
              <p className="text-xs text-slate-500 mb-2">
                {file.description}
              </p>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs text-slate-500">
              <span>누적 다운로드 횟수:</span>
              <span className="font-bold text-blue-600 font-mono">
                {file.downloadCount}회
              </span>
            </div>
          </div>

          {/* Countdown & Status */}
          <div className="mb-6">
            {countdown > 0 ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-sm font-medium">
                <Clock className="w-4 h-4 animate-spin text-amber-600" />
                <span>
                  <strong className="text-amber-900 font-bold">{countdown}초</strong> 후 자동 다운로드가 시작됩니다...
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>다운로드 횟수 카운트 완료! 다운로드 창이 열렸습니다.</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={triggerDownload}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>지금 바로 수동 다운로드</span>
            </button>

            <a
              href={getViewUrl(file.driveFileId, file.driveUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>구글 드라이브 원본 미리보기 뷰어로 열기</span>
            </a>
          </div>

          {/* Troubleshooting Checklist */}
          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-left text-[11px] text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1 text-amber-800">
              <Info className="w-3.5 h-3.5 shrink-0" />
              다운로드 파일이 컴퓨터에 안 받아지나요?
            </span>
            <ul className="list-disc list-inside text-amber-800/90 space-y-0.5 pl-0.5">
              <li>
                <strong>구글 드라이브 공유 권한:</strong> 파일이 <u>&apos;링크가 있는 모든 사용자(뷰어)&apos;</u>로 설정되어 있어야 외부 다운로드가 허용됩니다.
              </li>
              <li>
                <strong>브라우저 팝업 차단:</strong> 주소창 우측에 🚫(팝업 차단) 표시가 떴다면 &apos;항상 허용&apos;을 눌러주세요.
              </li>
            </ul>
          </div>

          {/* Security & Architecture Note */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>이 중간 페이지를 거치며 스프레드시트/DB에 카운터가 확실히 기록됩니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

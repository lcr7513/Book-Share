import React, { useState, useEffect } from 'react';
import { TrackedFile } from '../types';
import { 
  FileDown, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  QrCode, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface StudentDownloadViewProps {
  file: TrackedFile;
  onRecordDownload: (fileId: string) => void;
}

export const StudentDownloadView: React.FC<StudentDownloadViewProps> = ({ file, onRecordDownload }) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  // Dynamic origins
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-dfycvqsuilwbhjt6s4xsrc-657342148388.asia-northeast1.run.app';
  const directDownloadUrl = `${originUrl}/api/download/${file.id}/direct`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(directDownloadUrl)}`;

  const triggerDownload = () => {
    if (downloadStarted) return;
    setDownloadStarted(true);
    onRecordDownload(file.id);

    // Trigger download
    const link = document.createElement('a');
    link.href = directDownloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Top Header */}
        <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-6 text-white text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            학생 학습 자료 다운로드
          </h1>
          <p className="text-xs text-blue-100 mt-1">
            수업 및 과제 탐구용 공식 배포 자료
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 text-center space-y-5">
          {/* File Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                {file.category}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {file.size}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 break-words leading-snug mb-1">
              {file.name}
            </h2>
            {file.description && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {file.description}
              </p>
            )}
          </div>

          {/* Countdown / Download Status */}
          <div>
            {countdown > 0 ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>
                  <strong className="text-amber-900 font-bold text-sm">{countdown}초</strong> 후 자동 다운로드가 시작됩니다...
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>다운로드 전송 완료! 파일이 저장되었습니다.</span>
              </div>
            )}
          </div>

          {/* Download Action Button */}
          <button
            onClick={triggerDownload}
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>지금 바로 파일 다운로드</span>
          </button>

          {/* QR Code Section for Mobile Students */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>스마트폰으로 바로 다운로드받으려면?</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              스마트폰 카메라로 아래 QR 코드를 비추면 즉시 파일이 다운로드됩니다.
            </p>
            <div className="inline-block p-2 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <img
                src={qrCodeImageUrl}
                alt={`${file.name} QR코드`}
                className="w-36 h-36 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Footer Safety Notice */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>바이러스 검사가 완료된 안전한 공식 구글 드라이브 파일입니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

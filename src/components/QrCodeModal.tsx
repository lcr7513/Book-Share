import React, { useState } from 'react';
import { TrackedFile } from '../types';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Printer, 
  Sparkles, 
  ShieldCheck,
  Smartphone,
  Globe
} from 'lucide-react';

interface QrCodeModalProps {
  file: TrackedFile;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ file, onClose }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Dynamic origins
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-dfycvqsuilwbhjt6s4xsrc-657342148388.asia-northeast1.run.app';
  
  // 1. Direct download URL: Opens NO webpage, immediately downloads file to phone/PC and tracks count!
  const directDownloadUrl = `${originUrl}/api/download/${file.id}/direct`;

  // 2. Student single landing URL: Shows only this file's card with countdown and download button (NO admin screen)
  const studentPageUrl = `${originUrl}/?file=${file.id}`;

  // QR Code URL based on the direct download URL (when camera scans, download starts immediately!)
  const qrDirectImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=15&data=${encodeURIComponent(directDownloadUrl)}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadQrImage = async () => {
    try {
      const response = await fetch(qrDirectImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR코드_${file.name.replace(/\.[^/.]+$/, '')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      window.open(qrDirectImageUrl, '_blank');
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${file.name} - 학생 배포용 QR코드</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 40px; margin: 0; }
          .container { max-width: 450px; margin: 0 auto; border: 2px dashed #94a3b8; border-radius: 20px; padding: 30px; }
          h2 { margin: 0 0 10px; font-size: 22px; color: #0f172a; word-break: break-all; }
          p { color: #64748b; font-size: 14px; margin: 0 0 24px; }
          img { width: 260px; height: 260px; margin-bottom: 20px; }
          .badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 999px; font-size: 13px; font-weight: bold; margin-bottom: 12px; }
          .footer { font-size: 12px; color: #94a3b8; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">수업 및 과제 탐구 자료</div>
          <h2>${file.name}</h2>
          <p>스마트폰 기본 카메라로 아래 QR 코드를 비추면 자료가 즉시 다운로드됩니다.</p>
          <img src="${qrDirectImageUrl}" alt="QR코드" />
          <div class="footer">안전한 공식 구글 드라이브 다운로드</div>
        </div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-bold">학생 전용 배포 링크 &amp; 큐알(QR)코드</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-center">
          {/* Target File Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase mr-2">
              {file.category}
            </span>
            <span className="text-xs font-semibold text-slate-800 break-words">
              {file.name}
            </span>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              용량: {file.size} &middot; 누적 다운로드: {file.downloadCount}회
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-5 flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
              <img
                src={qrDirectImageUrl}
                alt={`${file.name} QR 코드`}
                className="w-44 h-44 object-contain"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>카메라로 스캔 시 즉시 다운로드 시작</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs">
              학생들이 카메라로 비추면 관리자 화면 없이 파일이 바로 기기로 쏙 저장됩니다.
            </p>

            {/* QR Code Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleDownloadQrImage}
                className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>QR코드 이미지 저장</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>안내장 인쇄용 창 열기</span>
              </button>
            </div>
          </div>

          {/* Share Links Selection */}
          <div className="space-y-3 text-left">
            {/* Option 1: Direct File Download Link (No screen, instant download) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  1. 학생 직다운로드 링크 (화면 없이 즉시 파일 저장)
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  추천 ⭐
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                카카오톡, 클래스룸에 보내기 가장 좋습니다. 클릭하자마자 파일이 바로 받아집니다.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={directDownloadUrl}
                  className="grow px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-700 select-all"
                />
                <button
                  onClick={() => handleCopy(directDownloadUrl, 'direct')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedType === 'direct' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'direct' ? '복사됨!' : '링크 복사'}</span>
                </button>
              </div>
            </div>

            {/* Option 2: Isolated Student Landing Page Link (Shows only this single file) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  2. 학생 전용 단독 화면 링크 (해당 파일 카드만 표시)
                </span>
                <a
                  href={studentPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <span>미리보기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500">
                전체 관리 화면은 전혀 보이지 않고, 오직 이 파일 1개만 다운로드 카드 형태로 표시됩니다.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={studentPageUrl}
                  className="grow px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-700 select-all"
                />
                <button
                  onClick={() => handleCopy(studentPageUrl, 'page')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedType === 'page' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'page' ? '복사됨!' : '링크 복사'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>선생님의 관리 화면, 통계 로그, 다른 파일 목록은 학생에게 일체 노출되지 않습니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

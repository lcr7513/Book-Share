import React, { useState } from 'react';
import { TrackedFile, DownloadLog } from '../types';
import { 
  extractGoogleDriveFileId, 
  getDirectDownloadUrl, 
  getViewUrl, 
  guessFileCategory 
} from '../utils/driveHelper';
import { 
  Plus, 
  FileDown, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  FileSpreadsheet, 
  Download, 
  BarChart, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Link2,
  HardDrive,
  Share2
} from 'lucide-react';

interface TrackerSimulatorProps {
  files: TrackedFile[];
  logs: DownloadLog[];
  onAddFile: (file: Omit<TrackedFile, 'id' | 'downloadCount' | 'createdAt'>) => void;
  onDeleteFile: (id: string) => void;
  onRecordDownload: (fileId: string) => void;
  onClearLogs: () => void;
  onPreviewLanding: (file: TrackedFile) => void;
}

export const TrackerSimulator: React.FC<TrackerSimulatorProps> = ({
  files,
  logs,
  onAddFile,
  onDeleteFile,
  onRecordDownload,
  onClearLogs,
  onPreviewLanding,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [customSize, setCustomSize] = useState('2.4 MB');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [justDownloadedId, setJustDownloadedId] = useState<string | null>(null);

  // Extracted file ID from user input
  const extractedId = extractGoogleDriveFileId(inputUrl);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedId) return;

    const name = customName.trim() || `드라이브_자료_${extractedId.slice(0, 6)}.${guessFileCategory(customName) === 'image' ? 'png' : 'pdf'}`;
    const category = guessFileCategory(name);

    onAddFile({
      name,
      driveUrl: inputUrl.trim(),
      driveFileId: extractedId,
      category,
      size: customSize.trim() || '1.8 MB',
      description: '추적 링크를 통해 다운로드 집계 중인 파일',
    });

    setInputUrl('');
    setCustomName('');
  };

  const loadPreset = (presetName: string, presetUrl: string, size: string) => {
    setInputUrl(presetUrl);
    setCustomName(presetName);
    setCustomSize(size);
  };

  const handleTriggerDownload = (file: TrackedFile) => {
    setJustDownloadedId(file.id);
    setTimeout(() => setJustDownloadedId(null), 1500);

    onRecordDownload(file.id);

    // Trigger direct download
    const directUrl = file.customTargetUrl || getDirectDownloadUrl(file.driveFileId, file.driveUrl);
    const link = document.createElement('a');
    link.href = directUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export logs to CSV
  const exportLogsToCsv = () => {
    if (logs.length === 0) return;
    const headers = ['로그ID,파일명,파일ID,기록일시,접속기기,상태'];
    const rows = logs.map((l) => 
      `"${l.id}","${l.fileName.replace(/"/g, '""')}","${l.fileId}","${l.timestamp}","${l.device}","${l.status}"`
    );
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `구글드라이브_다운로드기록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Top metrics
  const totalDownloads = files.reduce((acc, f) => acc + f.downloadCount, 0);
  const mostDownloaded = [...files].sort((a, b) => b.downloadCount - a.downloadCount)[0];

  return (
    <div className="space-y-8">
      {/* Hero Problem & Solution Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            핵심 원리 이해
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            구글 드라이브 파일 다운로드 횟수를 기록하는 원리
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            구글 드라이브의 기본 공유 링크(<code className="bg-blue-950/80 px-1.5 py-0.5 rounded text-blue-200">drive.google.com/file/d/...</code>)는 자체 다운로드 카운터를 제공하지 않습니다.
            <br />
            따라서 <strong>'중계 링크(스프레드시트 Web App, 카운터 웹페이지, 단축 URL)'</strong>를 생성하여,
            사용자가 클릭할 때 <strong>카운터를 +1 기록한 뒤 실제 구글 드라이브 다운로드 URL로 즉시 토스</strong>하는 방식을 사용합니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-xs">
              <span className="font-bold text-amber-300 block mb-1">1. 중계 링크 클릭</span>
              사용자가 배포된 링크를 클릭
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-xs">
              <span className="font-bold text-emerald-300 block mb-1">2. 횟수 & 일시 기록</span>
              구글 시트/DB에 카운트 +1 저장
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/10 backdrop-blur-xs">
              <span className="font-bold text-sky-300 block mb-1">3. 자동 다운로드 실행</span>
              0.5초 만에 실제 파일 다운로드 시작
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">총 누적 다운로드</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">
            {totalDownloads.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 ml-1">회</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">등록된 전체 파일 집계</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">관리 중인 파일</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-mono">
            {files.length}
            <span className="text-sm font-normal text-slate-500 ml-1">개</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">다운로드 추적 대상</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">최근 발생 로그</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {logs.length}
            <span className="text-sm font-normal text-slate-500 ml-1">건</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">스프레드시트 기록 연동</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 mb-1">최다 다운로드 파일</div>
          <div className="text-base font-bold text-slate-800 truncate" title={mostDownloaded?.name || '-'}>
            {mostDownloaded ? mostDownloaded.name : '-'}
          </div>
          <div className="text-[11px] text-blue-600 font-mono mt-1 font-semibold">
            {mostDownloaded ? `${mostDownloaded.downloadCount}회 다운로드됨` : '기록 없음'}
          </div>
        </div>
      </div>

      {/* Input Form: Add New Google Drive File */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-600" />
              내 구글 드라이브 파일 등록하여 카운터 테스트하기
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              구글 드라이브 공유 링크 또는 파일 ID를 입력하면 자동으로 ID를 분리하고 직다운로드 주소를 생성합니다.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium mr-1">빠른 테스트 샘플:</span>
            <button
              type="button"
              onClick={() => loadPreset('2026학년도_학사일정_및_수업자료_가이드.pdf', 'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing', '2.8 MB')}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 transition-colors cursor-pointer"
            >
              📄 학교 학사일정.pdf
            </button>
            <button
              type="button"
              onClick={() => loadPreset('학생_동의서_및_서약서_양식.docx', 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j_sample_doc/view', '450 KB')}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 transition-colors cursor-pointer"
            >
              📝 서약서 양식.docx
            </button>
          </div>
        </div>

        <form onSubmit={handleAddSubmit} className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Drive Link Input */}
            <div className="md:col-span-7">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                구글 드라이브 공유 링크 또는 파일 ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="예: https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono text-xs"
                required
              />
              
              {/* Live Extraction Feedback */}
              {inputUrl && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {extractedId ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>파일 ID 인식 완료:</span>
                      <strong className="font-mono">{extractedId}</strong>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>올바른 구글 드라이브 링크 형식(file/d/... 또는 id=...)인지 확인해주세요.</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* File Display Name */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                표시 파일명 (선택)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="예: 2026학년도 가정통신문.pdf"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-xs"
              />
            </div>

            {/* Estimated Size & Add Button */}
            <div className="md:col-span-2 flex flex-col justify-end">
              <button
                type="submit"
                disabled={!extractedId}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  extractedId
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>트래커 등록</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Files Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            추적 중인 구글 드라이브 파일 목록 ({files.length})
          </h3>
          <span className="text-xs text-slate-500">
            버튼을 눌러 다운로드 시 카운트가 즉시 1씩 증가하고 아래 로그에 반영됩니다.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => {
            const isJustDownloaded = justDownloadedId === file.id;
            const directUrl = getDirectDownloadUrl(file.driveFileId, file.driveUrl);

            return (
              <div
                key={file.id}
                className={`bg-white rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between shadow-xs ${
                  isJustDownloaded
                    ? 'border-emerald-500 ring-2 ring-emerald-100 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Bar: Category badge & Count badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wide">
                      {file.category}
                    </span>

                    {/* Download count badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                      <FileDown className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-semibold">누적:</span>
                      <strong className="text-sm font-mono font-bold text-blue-800">
                        {file.downloadCount}
                      </strong>
                      <span className="text-[11px]">회</span>
                    </div>
                  </div>

                  {/* File Title */}
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5 line-clamp-2" title={file.name}>
                    {file.name}
                  </h4>

                  {/* Metadata */}
                  <div className="text-xs text-slate-500 space-y-1 mb-4 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans text-[11px]">크기:</span>
                      <span>{file.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-sans text-[11px]">파일 ID:</span>
                      <span className="text-slate-600 truncate max-w-[150px]" title={file.driveFileId}>
                        {file.driveFileId}
                      </span>
                    </div>
                    {file.lastDownloadedAt && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-sans">최근 다운로드:</span>
                        <span className="text-emerald-700 font-medium">
                          {file.lastDownloadedAt.split(' ')[1]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {/* Download Button */}
                  <button
                    onClick={() => handleTriggerDownload(file)}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-98"
                  >
                    <Download className={`w-4 h-4 ${isJustDownloaded ? 'animate-bounce text-emerald-300' : ''}`} />
                    <span>다운로드</span>
                  </button>

                  {/* Secondary Utility Actions */}
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => onPreviewLanding(file)}
                      title="방문자용 다운로드 랜딩 화면 미리보기"
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>페이지</span>
                    </button>

                    <button
                      onClick={() => handleCopy(directUrl, `direct-${file.id}`)}
                      title="학생에게 공유할 다운로드 링크 복사"
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-700 flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                    >
                      {copiedId === `direct-${file.id}` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3 h-3 text-slate-500" />
                      )}
                      <span>학생 공유</span>
                    </button>

                    <button
                      onClick={() => onDeleteFile(file.id)}
                      title="목록에서 삭제"
                      className="py-1.5 px-2 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 flex items-center justify-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Download Audit Log Table (Spreadsheet Simulation) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                실시간 다운로드 기록 로그 (구글 스프레드시트 연동 결과)
              </h3>
              <p className="text-xs text-slate-500">
                다운로드가 발생할 때마다 아래처럼 일시, 파일명, 디바이스 정보가 실시간으로 행 추가됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportLogsToCsv}
              disabled={logs.length === 0}
              className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 엑셀 다운로드</span>
            </button>
            <button
              onClick={onClearLogs}
              disabled={logs.length === 0}
              className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>로그 초기화</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm">아직 다운로드 기록이 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">
                위의 파일 카드에서 <strong>[다운로드]</strong> 버튼을 눌러보세요!
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">기록 일시</th>
                  <th className="py-3 px-4">파일명</th>
                  <th className="py-3 px-4">파일 ID</th>
                  <th className="py-3 px-4">접속 기기/환경</th>
                  <th className="py-3 px-4">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-800">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-900 max-w-[220px] truncate" title={log.fileName}>
                      {log.fileName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[140px] truncate">
                      {log.fileId}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600">
                      {log.device}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" /> 집계 완료
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

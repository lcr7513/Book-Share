import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Play,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { extractGoogleDriveFileId, getDirectDownloadUrl, getViewUrl } from '../utils/driveHelper';

export const DiagnosticWizard: React.FC = () => {
  const [testInput, setTestInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Analysis result states
  const trimmed = testInput.trim();
  const hasInput = trimmed.length > 0;

  // 1. Is it a Google Apps Script web app URL?
  const isScriptUrl = trimmed.includes('script.google.com/macros/s/');
  const isDevUrl = isScriptUrl && trimmed.includes('/dev');
  const isExecUrl = isScriptUrl && trimmed.includes('/exec');

  // 2. Extract id from the input
  let parsedId = extractGoogleDriveFileId(trimmed);
  let idParameterFound = false;
  let isRawUrlInsideParam = false;

  if (trimmed.includes('?id=') || trimmed.includes('&id=')) {
    idParameterFound = true;
    const afterId = trimmed.split(/[?&]id=/)[1]?.split('&')[0];
    if (afterId && (afterId.includes('http') || afterId.includes('drive.google.com'))) {
      isRawUrlInsideParam = true;
    }
  }

  // 3. Document type
  const isGoogleDoc = trimmed.includes('docs.google.com/document');
  const isGoogleSlide = trimmed.includes('docs.google.com/presentation');
  const isGoogleSheet = trimmed.includes('docs.google.com/spreadsheets');

  // Generate fixed direct download link
  const fixedId = parsedId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
  const directDownloadLink = getDirectDownloadUrl(fixedId, trimmed);
  const driveViewLink = getViewUrl(fixedId, trimmed);

  // If it's a script URL, generate fixed script share URL
  let fixedScriptShareUrl = '';
  if (isScriptUrl) {
    const baseUrl = trimmed.split('?')[0].replace(/\/dev$/, '/exec');
    fixedScriptShareUrl = `${baseUrl}?id=${fixedId}`;
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleTryPreset = (url: string) => {
    setTestInput(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-rose-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-800/80 text-rose-200 text-xs font-semibold mb-3 border border-rose-600/30">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
            다운로드 오류 실시간 진단 & 해결
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            &quot;연결했는데 다운로드가 안 돼요!&quot; 원인 점검기
          </h2>
          <p className="text-rose-100 text-sm sm:text-base leading-relaxed mb-4">
            현재 사용 중이신 링크(Apps Script 주소 또는 구글 드라이브 주소)를 아래에 붙여넣으시면,
            어디서 막혔는지 <strong>4대 원인을 1초 만에 감지하고 즉시 다운로드되는 해결 링크</strong>를 만들어 드립니다.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            현재 테스트 중이신 주소(URL)를 입력해주세요:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="예: https://script.google.com/.../exec?id=... 또는 구글 드라이브 링크"
              className="grow px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-xs sm:text-sm font-mono outline-none"
            />
            {hasInput && (
              <button
                type="button"
                onClick={() => setTestInput('')}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* Example Quick Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 text-[11px]">자주 발생하는 오류 예시 테스트:</span>
          <button
            type="button"
            onClick={() => handleTryPreset('https://script.google.com/macros/s/AKfycbyXXX/dev?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')}
            className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
          >
            ⚠️ dev 링크 오류 예시
          </button>
          <button
            type="button"
            onClick={() => handleTryPreset('https://script.google.com/macros/s/AKfycbyXXX/exec?id=https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view')}
            className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer"
          >
            ⚠️ ?id=에 전체 URL 중복 입력 예시
          </button>
        </div>
      </div>

      {/* Diagnostic Analysis Report */}
      {hasInput && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              링크 자동 진단 결과
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              파일 ID 감지: {parsedId ? <strong className="text-emerald-600">{parsedId}</strong> : <span className="text-rose-600">미감지</span>}
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* Check 1: Script dev vs exec */}
            {isDevUrl && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 space-y-1">
                  <span className="font-bold text-sm text-rose-800 block">
                    🚨 치명적 원인: 테스트용 &apos;/dev&apos; URL을 사용하셨습니다!
                  </span>
                  <p>
                    URL 끝이 <code className="bg-rose-100 px-1 py-0.5 rounded font-bold font-mono">/dev</code>로 끝나는 주소는 구글 계정 본인만 접속할 수 있는 개발용 링크입니다. 다른 사람이나 일반 창에서는 다운로드가 막힙니다.
                  </p>
                  <p className="font-semibold text-rose-800 pt-1">
                    👉 해결: Apps Script 우측 상단 [배포] ➡️ [웹 앱 URL]에서 끝이 <code className="bg-rose-200 px-1 rounded font-mono">/exec</code>로 끝나는 정식 배포 링크를 사용해야 합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Check 2: Raw URL pasted into id param */}
            {isRawUrlInsideParam && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 space-y-1">
                  <span className="font-bold text-sm text-amber-800 block">
                    ⚠️ 원인: ?id= 파라미터에 전체 주소가 중복으로 들어갔습니다!
                  </span>
                  <p>
                    <code className="bg-amber-100 px-1 rounded font-mono">?id=https://drive.google.com/file/d/1BxiM...</code> 처럼 전체 링크를 통째로 넣으면 구글이 파일 ID가 아닌 것으로 오인하여 404 에러를 냅니다.
                  </p>
                  <p className="font-semibold text-amber-800 pt-1">
                    👉 해결: 아래 생성된 정정 링크처럼 파일 ID(<code className="bg-amber-200 px-1 rounded font-mono">{parsedId}</code>)만 남겨야 합니다.
                  </p>
                </div>
              </div>
            )}

            {/* Check 3: Is ID completely missing? */}
            {!parsedId && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-950 space-y-1">
                  <span className="font-bold text-sm text-rose-800 block">
                    🚨 원인: 구글 드라이브 파일 ID를 찾을 수 없습니다
                  </span>
                  <p>
                    주소에 파일 ID(영문, 숫자 33자리 내외)가 포함되어 있지 않습니다.
                  </p>
                </div>
              </div>
            )}

            {/* Check 4: Success / Ready to test */}
            {parsedId && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>정상 다운로드 가능한 URL 생성 완료! 지금 바로 테스트해보세요</span>
                </div>

                {/* Direct Google Drive Direct Download */}
                <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-2">
                  <div className="font-semibold text-slate-800 flex items-center justify-between">
                    <span>1. 구글 직다운로드 주소 (컴퓨터로 즉시 파일 저장):</span>
                    <a
                      href={directDownloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold underline"
                    >
                      <Play className="w-3.5 h-3.5" /> 지금 바로 다운로드
                    </a>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded border">
                    <span className="truncate grow">{directDownloadLink}</span>
                    <button
                      onClick={() => handleCopy(directDownloadLink)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                    >
                      {copiedLink ? '복사됨' : '복사'}
                    </button>
                  </div>
                </div>

                {/* If Apps Script URL */}
                {fixedScriptShareUrl && (
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs space-y-2">
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>2. 정정된 Google Apps Script 카운터 다운로드 주소:</span>
                      <a
                        href={fixedScriptShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-bold underline"
                      >
                        <Play className="w-3.5 h-3.5" /> 학생 공유 링크 실행
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded border">
                      <span className="truncate grow">{fixedScriptShareUrl}</span>
                      <button
                        onClick={() => handleCopy(fixedScriptShareUrl)}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                      >
                        {copiedLink ? '복사됨' : '복사'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Essential 4-Point Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          다운로드가 멈출 때 반드시 확인해야 할 4대 체크리스트
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Check 1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">1</span>
              <span>구글 드라이브 파일 공유 권한 (가장 중요 ⭐)</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              &apos;AI를 활용한 사회문제탐구&apos; 파일의 권한이 <strong>&apos;링크가 있는 모든 사용자(뷰어)&apos;</strong>로 풀려있어야 합니다.
              <br />
              만약 <strong>&apos;제한됨&apos;</strong> 또는 <strong>&apos;인천광역시교육청 사용자만&apos;</strong>으로 되어 있으면 구글이 외부 다운로드 요청을 즉시 차단합니다.
            </p>
          </div>

          {/* Check 2 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">2</span>
              <span>Apps Script 배포 권한 &apos;모든 사용자&apos; 여부</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Google Apps Script를 배포할 때 <strong>[액세스 권한이 있는 사용자]</strong>를 반드시 <strong>&apos;모든 사용자(Anyone)&apos;</strong>로 선택해야 합니다. &apos;나만&apos;으로 되어 있으면 다른 사람이 링크를 눌렀을 때 구글 로그인 창이 뜨며 멈춥니다.
            </p>
          </div>

          {/* Check 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">3</span>
              <span>주소 끝이 /dev가 아닌 /exec 인지 확인</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              웹 앱 URL 끝에 <code>/dev</code>가 붙어있으면 본인 전용 테스트 모드입니다.
              반드시 [배포] ➡️ [새 배포] 또는 [배포 관리]를 통해 생성된 <code>https://script.google.com/macros/s/.../exec</code> 주소를 사용하세요.
            </p>
          </div>

          {/* Check 4 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">4</span>
              <span>브라우저 상단 &apos;팝업 차단&apos; 해제</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              다운로드 버튼을 누르는 순간 브라우저 주소창 우측에 조그만 팝업 차단 아이콘(🚫)이 떴다면 그것을 클릭하고 <strong>&apos;항상 허용&apos;</strong>을 눌러주셔야 새 창 다운로드가 동작합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

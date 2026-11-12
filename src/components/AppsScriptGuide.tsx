import React, { useState } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE } from '../utils/gasCode';
import { 
  Copy, 
  Check, 
  Code2, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  HelpCircle,
  Play,
  Share2,
  Lock,
  Layers
} from 'lucide-react';

export const AppsScriptGuide: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [userWebappUrl, setUserWebappUrl] = useState('');
  const [sampleFileId, setSampleFileId] = useState('1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms');
  const [copiedFinalUrl, setCopiedFinalUrl] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const cleanWebappUrl = userWebappUrl.trim();
  const finalShareUrl = cleanWebappUrl
    ? `${cleanWebappUrl}${cleanWebappUrl.includes('?') ? '&' : '?'}id=${sampleFileId.trim()}`
    : `https://script.google.com/macros/s/AKfycbx_YOUR_DEPLOYMENT_ID/exec?id=${sampleFileId.trim()}`;

  const handleCopyFinalUrl = () => {
    navigator.clipboard.writeText(finalShareUrl);
    setCopiedFinalUrl(true);
    setTimeout(() => setCopiedFinalUrl(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Value Banner */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            가장 추천하는 방법 (100% 무료 & 영구 소장)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Google Apps Script + 구글 스프레드시트 연동
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-4">
            별도의 유료 서버나 개발 지식 없이, 구글 계정만으로 <strong>구글 스프레드시트에 파일별 다운로드 일시와 누적 횟수를 자동 기록</strong>하는 가장 깔끔하고 안전한 공식 방법입니다.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-600/40 font-medium">
              ✅ 비용: 0원 (구글 무료 제공)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-600/40 font-medium">
              ✅ 소요시간: 약 3분
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-800/80 border border-emerald-600/40 font-medium">
              ✅ 내 스프레드시트 비공개 보호
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Step Navigator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            3분 완성 단계별 설정 가이드
          </h3>
          <span className="text-xs text-slate-400">클릭하여 해당 단계 보기</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { num: 1, title: '1단계: 스프레드시트 생성', sub: '확장 프로그램 열기' },
            { num: 2, title: '2단계: 코드 붙여넣기', sub: 'GAS 소스코드 복사' },
            { num: 3, title: '3단계: 웹 앱 배포', sub: '모든 사용자 권한' },
            { num: 4, title: '4단계: 다운로드 링크 사용', sub: 'URL 완성 및 배포' },
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                activeStep === step.num
                  ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    activeStep === step.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {step.num}
                </span>
                <span className="font-semibold text-xs text-slate-800">{step.title}</span>
              </div>
              <div className="text-[11px] text-slate-500 pl-7">{step.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Panels */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
              <FileSpreadsheet className="w-6 h-6" />
              <span>1단계: 새 구글 스프레드시트 생성 및 Apps Script 접속</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              기록을 저장할 구글 스프레드시트를 하나 새로 만듭니다. (시트 이름은 자유롭게 지정하세요)
            </p>

            <ol className="list-decimal list-inside space-y-3 text-sm text-slate-700 font-medium pl-1">
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  sheets.new <ExternalLink className="w-3.5 h-3.5" />
                </a>
                를 브라우저에 입력하여 <strong>새 구글 스프레드시트</strong>를 엽니다.
                (예: <code>구글 드라이브 다운로드 집계장</code>)
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                상단 메뉴에서 <strong>[확장 프로그램]</strong> &gt; <strong>[Apps Script]</strong>를 클릭합니다.
              </li>
              <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                새 탭으로 Apps Script 코드 편집창이 열립니다. (기존에 적힌 <code>function myFunction() &#123;&#125;</code>는 모두 지워줍니다.)
              </li>
            </ol>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                다음: 2단계 코드 복사 &gt;
              </button>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
                <Code2 className="w-6 h-6" />
                <span>2단계: 완성형 Google Apps Script 소스코드 복사</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? '복사되었습니다!' : '전체 코드 원클릭 복사'}</span>
              </button>
            </div>
            <p className="text-sm text-slate-600">
              아래 코드를 복사하여 Apps Script 편집기(<code>Code.gs</code>)에 전체 덮어쓰기 붙여넣기 한 뒤, 상단의 <strong>💾 [저장]</strong> 아이콘(Ctrl+S)을 누르세요.
            </p>

            {/* Code Box */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 font-mono text-xs">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <span>Code.gs</span>
                <span className="text-[11px]">JavaScript (Apps Script)</span>
              </div>
              <pre className="p-4 overflow-x-auto max-h-[380px] leading-relaxed">
                <code>{GOOGLE_APPS_SCRIPT_CODE}</code>
              </pre>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setActiveStep(1)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                &lt; 이전 단계
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                다음: 3단계 배포하기 &gt;
              </button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
              <Share2 className="w-6 h-6" />
              <span>3단계: 웹 앱(Web App)으로 배포 (★가장 중요!)</span>
            </div>
            <p className="text-sm text-slate-600">
              누구나 로그인 없이 링크를 통해 파일을 다운받을 수 있도록 배포 옵션을 정확히 설정해야 합니다.
            </p>

            <div className="space-y-3 text-sm text-slate-700 font-medium">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. [배포] &gt; [새 배포] 클릭</span>
                Apps Script 우측 상단의 파란색 <strong>[배포]</strong> 버튼을 누르고 <strong>[새 배포]</strong>를 선택합니다.
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. 유형 선택: [웹 앱]</span>
                좌측 톱니바퀴 아이콘을 누르고 <strong>웹 앱(Web App)</strong>을 선택합니다.
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">3. 권한 옵션 2가지 필수 체크 (핵심!)</span>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>
                        <strong>다음 사용자로서 실행:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">나(내 이메일)</code> 선택
                      </li>
                      <li>
                        <strong>액세스 권한이 있는 사용자:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-bold">모든 사용자(Anyone)</code> 선택
                        <br />
                        <span className="text-[11px] text-amber-800">
                          (※ '모든 사용자'로 설정해야 다른 사람이 구글 로그인하지 않아도 즉시 카운팅되고 다운로드됩니다. 스프레드시트 원본은 여전히 나만 볼 수 있으므로 완전히 안전합니다.)
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">4. [배포] 클릭 및 최초 권한 승인</span>
                최초 1회 구글 계정 권한 승인 창(고급 &gt; 이동)이 뜨면 허용해줍니다.
                <br />
                배포가 끝나면 <code className="bg-slate-200 px-1.5 py-0.5 rounded text-blue-700 font-mono text-xs">https://script.google.com/macros/s/.../exec</code> 형태의 <strong>웹 앱 URL</strong>이 복사 가능하게 표시됩니다!
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                &lt; 이전 단계
              </button>
              <button
                onClick={() => setActiveStep(4)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                다음: 4단계 링크 완성 &gt;
              </button>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
              <Play className="w-6 h-6" />
              <span>4단계: 최종 다운로드 추적 링크 완성 및 배포</span>
            </div>
            <p className="text-sm text-slate-600">
              배포받은 웹 앱 URL 뒤에 <code>?id=파일ID</code>를 붙여주면 끝입니다! 이제 사람들에게 구글 드라이브 원본 링크 대신 이 링크를 보내주세요.
            </p>

            {/* Live Interactive Link Builder */}
            <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                🔗 내 다운로드 추적 링크 즉시 조합기
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    배포된 내 Apps Script 웹 앱 URL:
                  </label>
                  <input
                    type="text"
                    value={userWebappUrl}
                    onChange={(e) => setUserWebappUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    추적할 구글 드라이브 파일 ID:
                  </label>
                  <input
                    type="text"
                    value={sampleFileId}
                    onChange={(e) => setSampleFileId(e.target.value)}
                    placeholder="구글 드라이브 파일 ID"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">
                    🎯 완성된 공유용 다운로드 링크 (사람들에게 전달할 URL):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={finalShareUrl}
                      className="w-full px-3 py-2 text-xs font-mono bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-300 select-all"
                    />
                    <button
                      onClick={handleCopyFinalUrl}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedFinalUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>복사</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">📊 내 스프레드시트 변화</span>
                누군가 링크를 누르면 내 구글 스프레드시트에 <code className="bg-slate-200 px-1 py-0.5 rounded">상세_로그</code> 시트와 <code className="bg-slate-200 px-1 py-0.5 rounded">파일별_통계</code> 시트가 자동으로 생성되며 카운트가 1씩 올라갑니다.
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-800 block mb-1">🚀 다운로더(상대방) 화면</span>
                부드러운 다운로드 진행 카드(&quot;다운로드가 곧 시작됩니다&quot;)가 나타나고 0.8초 후 구글 드라이브 파일 다운로드가 자동으로 시작됩니다.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pro Tips & Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          자주 묻는 질문 & 핵심 팁 (FAQ)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-600" />
              Q. 제 스프레드시트 내용이 다른 사람에게 공개되나요?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              <strong>절대 공개되지 않습니다.</strong> 웹 앱은 스크립트 실행 권한만 위임받아 파일 다운로드와 시트 기록만 대행할 뿐, 스프레드시트 원본 문서는 오직 생성자 본인만 접근할 수 있습니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Q. 다운로드할 때 구글 드라이브 파일 공유 권한은 어떻게 해야 하나요?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              구글 드라이브 원본 파일의 권한이 <strong>&apos;링크가 있는 모든 사용자에게 공개(뷰어)&apos;</strong>로 설정되어 있어야 상대방이 로그인 없이 정상적으로 파일을 내려받을 수 있습니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              Q. 100MB 이상 큰 파일도 카운팅이 되나요?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              네! 카운팅은 링크를 클릭하는 순간 스프레드시트에 즉시 기록됩니다. 다만 구글 드라이브 정책상 100MB 초과 대용량 파일은 &apos;바이러스 검사를 할 수 없습니다&apos;라는 구글 자체 확인 창이 한 번 뜰 수 있습니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Q. 파일이 여러 개인데 링크를 매번 새로 배포해야 하나요?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              아닙니다! <strong>웹 앱 배포는 최초 1번만</strong> 해두면, URL 뒤의 <code>?id=파일ID</code> 부분만 파일별로 바꿔서 무제한으로 여러 파일을 하나의 스프레드시트에서 관리할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

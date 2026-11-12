import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  ExternalLink,
  Users,
  EyeOff
} from 'lucide-react';

export const WorkspaceAuditGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/20">
            <GraduationCap className="w-3.5 h-3.5" />
            교육청(icedu.kr) 및 Google Workspace 기관용
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Google Workspace 관리자 감사 로그(Audit Log)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            학교나 교육청(<code>@icedu.kr</code>), 기업 등 <strong>Google Workspace 조직 계정</strong>을 사용 중인 경우,
            조직 내 드라이브 파일의 모든 <strong>다운로드·조회·수정 이력</strong>이 구글 서버에 자동 기록됩니다.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              🏫 교육기관(Education) / 기업용 전용 기능
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              🔒 누가 언제 다운로드했는지 계정 단위 추적 가능
            </span>
          </div>
        </div>
      </div>

      {/* Two Roles Comparison: Admin vs General Teacher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Console View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-base mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span>조직 관리자(정보부장·전산관리자) 권한이 있는 경우</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Google Workspace 관리 콘솔(Admin Console)에서 다운로드 내역을 엑셀로 추출할 수 있습니다.
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 font-medium">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>1. 관리 콘솔 접속:</strong> <a href="https://admin.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">admin.google.com</a>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>2. 메뉴 이동:</strong> [보고(Reporting)] &gt; [감사 및 조사(Audit and investigation)] &gt; [드라이브 로그 이벤트]
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>3. 필터 조건 추가:</strong>
                <ul className="list-disc list-inside mt-1 text-slate-600 space-y-0.5">
                  <li>이벤트 이름(Event name): <code>다운로드(Download)</code></li>
                  <li>문서 이름(Document title) 또는 문서 ID: 해당 파일 검색</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong>4. 결과 확인:</strong> 다운로드한 사용자 이메일, 다운로드 일시, IP 주소 및 기기 내역이 전부 표로 나타납니다.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>별도 설정 없이도 과거 최대 6개월~수년간의 기록을 즉시 조회 가능</span>
          </div>
        </div>

        {/* Regular Teacher/User View */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base mb-3">
              <EyeOff className="w-5 h-5 text-amber-500" />
              <span>일반 사용자·선생님 계정인 경우 (관리자 권한 없음)</span>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              구글 드라이브 기본 화면에서는 다운로드 카운터가 노출되지 않으므로 주의가 필요합니다.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                <span className="font-bold block mb-1">⚠️ 드라이브 우측 [세부정보 &gt; 활동] 패널의 한계</span>
                구글 드라이브에서 파일을 선택하고 <code>ℹ️ 세부정보 &gt; 활동(Activity)</code>을 보면
                &apos;파일 수정&apos;, &apos;이동&apos;, &apos;권한 변경&apos;은 보이지만, <strong>단순 링크를 통한 다운로드/조회 횟수는 집계되지 않습니다.</strong>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed">
                <span className="font-bold block mb-1">💡 일반 교사/사용자를 위한 최선의 해결책</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  <li>
                    <strong>방법 1 (적극 권장):</strong> 첫 번째 탭에서 안내드린 <strong>&apos;Google Apps Script + 스프레드시트&apos;</strong>를 사용해 나만의 다운로드 링크를 배포하세요. 관리자 권한 없이도 100% 무료로 정확히 집계됩니다.
                  </li>
                  <li>
                    <strong>공식 감사 필요 시:</strong> 학교 정보부장님이나 교육청 시스템 관리자에게 파일 링크를 전달하고 &quot;드라이브 다운로드 감사 로그 추출&quot;을 요청하시면 엑셀 파일로 전달받으실 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>학생 또는 학부모 대상 가정통신문·서식 배포 시 Apps Script 방식이 가장 간편합니다</span>
          </div>
        </div>
      </div>

      {/* School / Education Real-World Workflow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          교육 현장(학교) 실무 추천 시나리오
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 text-sm block mb-1">1. 가정통신문 / 학사안내</span>
            <p className="text-slate-600 leading-relaxed">
              학부모님들에게 배포할 때는 구글 로그인을 요구하면 안 되므로, <strong>Google Apps Script 웹 앱(액세스 권한: 모든 사용자)</strong>으로 링크를 만들어 학교 홈페이지나 알림장에 게시하세요.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 text-sm block mb-1">2. 학생 과제 서식 / 학습지</span>
            <p className="text-slate-600 leading-relaxed">
              학급 학생들이 학습지를 몇 명이나 내려받았는지 실시간 스프레드시트로 확인하여 미다운로드 학생들을 파악하고 독려할 수 있습니다.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 text-sm block mb-1">3. 교내 교직원 연수 자료</span>
            <p className="text-slate-600 leading-relaxed">
              학교 내부 교직원용 대용량 연수 영상이나 문서는 Google Workspace 공유 드라이브에 올린 후 감사 로그를 확인하거나 스프레드시트 트래커로 취합할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

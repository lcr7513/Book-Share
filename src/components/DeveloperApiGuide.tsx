import React, { useState } from 'react';
import { 
  Terminal, 
  Globe, 
  Link, 
  Copy, 
  Check, 
  ExternalLink, 
  Code,
  Zap,
  ArrowRight
} from 'lucide-react';

export const DeveloperApiGuide: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const expressCode = `// Node.js + Express 다운로드 카운터 & 리다이렉트 예제
const express = require('express');
const app = express();

// 메모리 또는 DB에 카운트 저장
const downloadCounts = {};

app.get('/download/:fileId', async (req, res) => {
  const { fileId } = req.params;
  
  // 1. 다운로드 카운트 증가 & DB 기록
  downloadCounts[fileId] = (downloadCounts[fileId] || 0) + 1;
  console.log(\`[다운로드 기록] 파일 ID: \${fileId}, 누적: \${downloadCounts[fileId]}회\`);
  
  // 2. 구글 드라이브 실제 다운로드 주소로 302 리다이렉트
  const driveDownloadUrl = \`https://drive.google.com/uc?export=download&id=\${fileId}\`;
  return res.redirect(driveDownloadUrl);
});

app.listen(3000, () => console.log('서버 실행: 포트 3000'));`;

  const pythonCode = `# Python FastAPI 다운로드 카운터 & 리다이렉트 예제
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from datetime import datetime

app = FastAPI()
counter_db = {}

@app.get("/download/{file_id}")
async def track_and_download(file_id: str):
    # 1. 횟수 기록
    counter_db[file_id] = counter_db.get(file_id, 0) + 1
    print(f"[{datetime.now()}] {file_id} 다운로드 수: {counter_db[file_id]}")
    
    # 2. 구글 드라이브 직다운로드 링크로 리다이렉트
    drive_url = f"https://drive.google.com/uc?export=download&id={file_id}"
    return RedirectResponse(url=drive_url, status_code=302)`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/20">
            <Terminal className="w-3.5 h-3.5" />
            자체 웹사이트 & 간편 단축 링크 방식
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            웹 서버 API 리다이렉트 또는 단축 URL 서비스
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            자체 홈페이지나 블로그를 운영 중이시라면 <strong>백엔드 엔드포인트</strong>를 통해 집계하거나,
            가장 빠르게 1분 만에 끝내고 싶다면 <strong>Bitly 같은 단축 URL 서비스</strong>를 이용할 수 있습니다.
          </p>
        </div>
      </div>

      {/* Method 4: Bitly Short URL (Super Quick) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
          <Zap className="w-5 h-5" />
          <span>방법 4. 초간단 1분 컷: 통계 제공 단축 URL 서비스 (Bitly, TinyURL 등)</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          코딩이나 스프레드시트 설정이 번거롭다면, <strong>구글 드라이브 직접 다운로드 주소</strong>를 생성한 뒤 단축 URL 사이트에 등록하면 클릭(다운로드 시도) 횟수가 무료로 집계됩니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">1단계: 직다운로드 URL 만들기</span>
            구글 드라이브 파일 ID를 다음 형식에 대입합니다:
            <br />
            <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-700 font-mono text-[11px] block mt-1 break-all">
              https://drive.google.com/uc?export=download&id=파일ID
            </code>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">2단계: Bitly 등에 단축 링크 생성</span>
            <a href="https://bitly.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold inline-flex items-center gap-1">
              bitly.com <ExternalLink className="w-3 h-3" />
            </a>
            에 접속하여 위 직다운로드 URL을 붙여넣고 짧은 링크를 발급받습니다.
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-slate-900 block mb-1">3단계: 클릭 수(다운로드) 확인</span>
            배포 후 Bitly 대시보드에서 일별 클릭 수, 접속 국가, 유입 경로를 그래프로 확인합니다.
          </div>
        </div>
      </div>

      {/* Method 3: Backend Server Redirect */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-base">
          <Globe className="w-5 h-5" />
          <span>방법 3. 웹 서비스/자체 서버를 통한 API 중계 리다이렉트</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          자체 백엔드 서버(Node.js, Python, Java, PHP 등)가 있다면 사용자가 다운로드 버튼을 누를 때 
          서버의 특정 API(<code>/download/:id</code>)를 호출하도록 하고,
          서버에서 DB의 카운터를 올린 뒤 HTTP 302 리다이렉트로 구글 드라이브 다운로드 URL을 응답하는 패턴입니다.
        </p>

        {/* Code Snippets */}
        <div className="space-y-4">
          {/* Node.js Express */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-sans font-semibold">
                <Code className="w-3.5 h-3.5 text-blue-400" /> Node.js (Express) 구현 예시
              </span>
              <button
                onClick={() => handleCopy(expressCode, 'express')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'express' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'express' ? '복사됨' : '복사'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{expressCode}</code>
            </pre>
          </div>

          {/* Python FastAPI */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-sans font-semibold">
                <Code className="w-3.5 h-3.5 text-indigo-400" /> Python (FastAPI) 구현 예시
              </span>
              <button
                onClick={() => handleCopy(pythonCode, 'python')}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'python' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'python' ? '복사됨' : '복사'}</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto leading-relaxed">
              <code>{pythonCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

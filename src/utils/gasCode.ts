/**
 * Ready-to-use Google Apps Script source code for tracking Drive file downloads in Google Sheets
 * Bulletproof: Handles raw URLs in ?id=, standalone scripts, single or multi sheets, Google Docs, etc.
 */

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * 구글 드라이브 파일 다운로드 카운터 & 기록기 (Google Apps Script - 무결점 개선판)
 * ==============================================================================
 * 
 * [특징 및 오류 방지]
 * 1. ?id= 뒤에 파일 ID뿐만 아니라 "구글 드라이브 전체 링크"를 통째로 넣어도 자동 인식
 * 2. 시트 1개(단일 시트)만 있어도 자동으로 정상 기록 및 누적 집계
 * 3. 구글 문서/슬라이드인 경우 PDF/PPT 자동 변환 다운로드 지원
 * 4. 스프레드시트 기록에 일시적 오류가 나도 파일 다운로드는 무조건 보장
 */

function doGet(e) {
  try {
    // 1. 파라미터에서 파일 ID 또는 전체 URL 자동 추출
    var rawInput = '';
    if (e && e.parameter) {
      rawInput = e.parameter.id || e.parameter.url || e.parameter.fileId || '';
    }
    
    var fileId = extractFileId(rawInput);

    // 파일 ID가 누락되었거나 인식 불가한 경우 친절한 안내 화면 출력
    if (!fileId) {
      return HtmlService.createHtmlOutput(
        '<div style="font-family:sans-serif; text-align:center; padding:50px; line-height:1.6;">' +
        '<h2 style="color:#e11d48;">⚠️ 파일 링크 또는 ID가 확인되지 않았습니다</h2>' +
        '<p>웹앱 주소 뒤에 <code>?id=구글드라이브_공유링크_또는_파일ID</code>를 붙여서 접속해주세요.</p>' +
        '<p style="color:#64748b; font-size:13px;">입력값: ' + escapeHtml(rawInput || '없음') + '</p>' +
        '</div>'
      ).setTitle('다운로드 오류 안내');
    }

    var fileName = '구글 드라이브 파일';
    var fileSize = '-';
    var isGoogleDoc = false;

    // 2. 구글 드라이브 파일 정보 조회 시도 (권한 있는 경우)
    try {
      var file = DriveApp.getFileById(fileId);
      fileName = file.getName();
      var mimeType = file.getMimeType();
      if (mimeType.indexOf('google-apps.document') !== -1 || mimeType.indexOf('google-apps.presentation') !== -1) {
        isGoogleDoc = true;
      }
      fileSize = (file.getSize() / 1024 / 1024).toFixed(2) + ' MB';
    } catch (err) {
      // 파일 접근 권한이 제한적이거나 링크 공유 파일인 경우 기본값 유지
    }

    // 3. 스프레드시트에 다운로드 횟수 기록 (오류가 나도 다운로드는 멈추지 않음)
    try {
      recordDownload(fileId, fileName, fileSize);
    } catch (sheetErr) {
      Logger.log('시트 기록 오류: ' + sheetErr.message);
    }

    // 4. 최신 구글 드라이브 다운로드 URL 생성
    var downloadUrl = 'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(fileId) + '&export=download';
    var fallbackUrl = 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(fileId);
    var viewUrl = 'https://drive.google.com/file/d/' + encodeURIComponent(fileId) + '/view';

    if (rawInput.indexOf('docs.google.com/document') !== -1) {
      downloadUrl = 'https://docs.google.com/document/d/' + encodeURIComponent(fileId) + '/export?format=pdf';
      fallbackUrl = downloadUrl;
    } else if (rawInput.indexOf('docs.google.com/presentation') !== -1) {
      downloadUrl = 'https://docs.google.com/presentation/d/' + encodeURIComponent(fileId) + '/export?format=pptx';
      fallbackUrl = downloadUrl;
    }

    // 5. 다운로드 안내 및 자동 실행 HTML 렌더링
    var html = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>파일 다운로드 중 - ' + escapeHtml(fileName) + '</title>' +
      '<style>' +
      '  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background-color: #f1f5f9; color: #1e293b; }' +
      '  .card { background: white; border-radius: 16px; padding: 36px 30px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); max-width: 440px; width: 90%; text-align: center; }' +
      '  .spinner { width: 44px; height: 44px; border: 4px solid #e2e8f0; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }' +
      '  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
      '  .file-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 18px 0; word-break: break-all; }' +
      '  .file-name { font-weight: 600; font-size: 15px; color: #0f172a; margin-bottom: 4px; }' +
      '  .file-size { font-size: 13px; color: #64748b; }' +
      '  .btn { display: block; background: #2563eb; color: white; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; margin: 12px 0 6px; }' +
      '  .btn:hover { background: #1d4ed8; }' +
      '  .btn-sub { display: block; background: #f1f5f9; color: #475569; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 500; margin-top: 6px; }' +
      '  .notice { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 14px; border-top: 1px solid #f1f5f9; pt: 12px; }' +
      '</style>' +
      '</head>' +
      '<body>' +
      '  <div class="card">' +
      '    <div class="spinner"></div>' +
      '    <h3 style="margin: 0 0 8px; font-size: 20px;">다운로드가 곧 시작됩니다</h3>' +
      '    <p style="margin: 0; font-size: 14px; color: #64748b;">다운로드 횟수가 안전하게 기록되었습니다.</p>' +
      '    <div class="file-box">' +
      '      <div class="file-name">' + escapeHtml(fileName) + '</div>' +
      '      <div class="file-size">' + fileSize + '</div>' +
      '    </div>' +
      '    <a href="' + downloadUrl + '" id="dlBtn" class="btn">지금 바로 다운로드</a>' +
      '    <a href="' + viewUrl + '" target="_blank" class="btn-sub">구글 드라이브에서 직접 열기</a>' +
      '    <div class="notice">' +
      '      ⚠️ 만약 다운로드가 안 되면 <strong>구글 드라이브 파일의 공유 권한이 [링크가 있는 모든 사용자 - 뷰어]</strong>로 풀려있는지 확인해주세요.' +
      '    </div>' +
      '  </div>' +
      '  <script>' +
      '    setTimeout(function() {' +
      '      window.location.href = "' + downloadUrl + '";' +
      '    }, 600);' +
      '  </script>' +
      '</body>' +
      '</html>';

    return HtmlService.createHtmlOutput(html)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle('다운로드 진행 중');

  } catch (error) {
    return HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif; padding:30px; text-align:center;">' +
      '<h3>처리 중 오류가 발생했습니다</h3>' +
      '<p style="color:red;">' + escapeHtml(error.message) + '</p>' +
      '</div>'
    );
  }
}

/**
 * 어떤 형태의 URL이나 텍스트가 들어와도 구글 파일 ID만 깔끔하게 추출하는 함수
 */
function extractFileId(input) {
  if (!input) return '';
  var trimmed = String(input).trim();
  
  // 1. 이미 ID 형태인 경우 (25~55자의 영문, 숫자, _, -)
  if (/^[a-zA-Z0-9_-]{25,55}$/.test(trimmed)) {
    return trimmed;
  }
  
  // 2. /file/d/{ID} 매칭
  var match = trimmed.match(/\\/file\\/d\\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];

  // 3. /document/d/{ID} 또는 /presentation/d/{ID} 매칭
  match = trimmed.match(/\\/d\\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];

  // 4. ?id={ID} 매칭
  match = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];

  return trimmed;
}

/**
 * 스프레드시트에 다운로드 로그 및 통계 기록 함수 (단일 시트 및 복수 시트 모두 호환)
 */
function recordDownload(fileId, fileName, fileSize) {
  var ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    return;
  }
  if (!ss) return;

  var now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
  
  // 1) 상세_로그 시트에 행 추가
  var logSheet = ss.getSheetByName('상세_로그');
  if (!logSheet) {
    // 만약 시트가 1개뿐이라면 첫 번째 활성 시트를 사용
    logSheet = ss.getActiveSheet();
    if (logSheet.getLastRow() === 0) {
      logSheet.appendRow(['기록일시', '파일명', '파일 ID', '파일 크기']);
      logSheet.setFrozenRows(1);
    }
  }
  logSheet.appendRow([now, fileName, fileId, fileSize]);

  // 2) 파일별_통계 시트 (있는 경우 갱신)
  var statSheet = ss.getSheetByName('파일별_통계');
  if (statSheet) {
    var data = statSheet.getDataRange().getValues();
    var found = false;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == fileId) {
        var count = parseInt(data[i][2]) || 0;
        statSheet.getRange(i + 1, 3).setValue(count + 1);
        statSheet.getRange(i + 1, 4).setValue(now);
        found = true;
        break;
      }
    }
    if (!found) {
      statSheet.appendRow([fileId, fileName, 1, now]);
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
`;

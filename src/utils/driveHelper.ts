/**
 * Google Drive URL Parser & Direct Download Link Utility
 */

export function extractGoogleDriveFileId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If user passed a bare file ID (usually 25-50 chars alphanumeric with _ or -)
  if (/^[a-zA-Z0-9_-]{25,55}$/.test(trimmed)) {
    return trimmed;
  }

  // Matching pattern /file/d/{FILE_ID}
  const fileDPattern = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const matchFileD = trimmed.match(fileDPattern);
  if (matchFileD && matchFileD[1]) {
    return matchFileD[1];
  }

  // Matching query parameter ?id={FILE_ID} or &id={FILE_ID}
  const idQueryPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const matchQuery = trimmed.match(idQueryPattern);
  if (matchQuery && matchQuery[1]) {
    return matchQuery[1];
  }

  // Matching /folders/{FOLDER_ID}
  const folderPattern = /\/folders\/([a-zA-Z0-9_-]+)/;
  const matchFolder = trimmed.match(folderPattern);
  if (matchFolder && matchFolder[1]) {
    return matchFolder[1];
  }

  // Matching /d/{FILE_ID}
  const dPattern = /\/d\/([a-zA-Z0-9_-]+)/;
  const matchD = trimmed.match(dPattern);
  if (matchD && matchD[1]) {
    return matchD[1];
  }

  return null;
}

export function getDirectDownloadUrl(fileId: string, originalUrl?: string): string {
  const url = originalUrl || '';
  if (url.includes('docs.google.com/document')) {
    // Google Doc export to PDF or DOCX
    return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  }
  if (url.includes('docs.google.com/presentation')) {
    // Google Slides export to PDF or PPTX
    return `https://docs.google.com/presentation/d/${fileId}/export?format=pptx`;
  }
  if (url.includes('docs.google.com/spreadsheets')) {
    // Google Sheets export to XLSX
    return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=xlsx`;
  }
  // Standard Google Drive direct download endpoint
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

export function getViewUrl(fileId: string, originalUrl?: string): string {
  const url = originalUrl || '';
  if (url.includes('docs.google.com/document')) {
    return `https://docs.google.com/document/d/${fileId}/edit`;
  }
  if (url.includes('docs.google.com/presentation')) {
    return `https://docs.google.com/presentation/d/${fileId}/edit`;
  }
  if (url.includes('docs.google.com/spreadsheets')) {
    return `https://docs.google.com/spreadsheets/d/${fileId}/edit`;
  }
  return `https://drive.google.com/file/d/${fileId}/view`;
}

export function getPreviewEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function guessFileCategory(name: string): 'pdf' | 'doc' | 'sheet' | 'slide' | 'image' | 'archive' | 'other' {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.hwp') || lower.endsWith('.hwpx') || lower.endsWith('.txt')) return 'doc';
  if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || lower.endsWith('.csv')) return 'sheet';
  if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) return 'slide';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.gif') || lower.endsWith('.webp') || lower.endsWith('.svg')) return 'image';
  if (lower.endsWith('.zip') || lower.endsWith('.rar') || lower.endsWith('.7z') || lower.endsWith('.tar')) return 'archive';
  return 'other';
}

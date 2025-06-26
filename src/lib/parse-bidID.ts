// lib/parse-bibId.ts
export function extractBibId(url: string): string {
  const bibIdMatch = url.match(/bibID=(\d+)/i);
  if (!bibIdMatch || !bibIdMatch[1]) {
    throw new Error('Invalid Destiny URL format - bibID not found');
  }
  return bibIdMatch[1];
}

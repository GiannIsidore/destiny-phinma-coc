export interface DestinyBook {
  bibID: string;
  title: string;
  imageUrl?: string;
}

export function generateDestinyUrl(bibID: string): string {
  // Include all necessary parameters for a valid book details request
  const params = {
    bibID: bibID,
    site: '100',
    siteTypeID: '-2',
    includeLibrary: 'true',
    includeMedia: 'false',
    mediaSiteID: '',
    walkerID: Date.now().toString(), // Generate a fresh walkerID
    context: 'saas910_8520022'
  };

  const searchParams = new URLSearchParams(params);
  return `https://phinmacoclibrary-opac.follettdestiny.com/cataloging/servlet/presenttitledetailform.do?${searchParams.toString()}`;
}

export function extractBibID(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    // Try to get bibID from query params first
    let bibID = parsedUrl.searchParams.get('bibID');

    // If not found, check hash fragment
    if (!bibID && parsedUrl.hash) {
      bibID = new URLSearchParams(parsedUrl.hash.slice(1)).get('bibID');
    }

    return bibID;
  } catch (error) {
    console.error("Error parsing destiny URL:", error);
    return null;
  }
}

export function validateDestinyUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'phinmacoclibrary-opac.follettdestiny.com' &&
           (parsedUrl.pathname.includes('/servlet/presenttitledetailform.do') ||
            parsedUrl.pathname === '/common/welcome.jsp') &&
           (parsedUrl.searchParams.has('bibID') || parsedUrl.hash.includes('bibID='));
  } catch {
    return false;
  }
}

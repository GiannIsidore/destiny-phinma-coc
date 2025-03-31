import CryptoJS from 'crypto-js';

// This should be a complex secret key - in production, this should be in an environment variable
const SECRET_KEY = 'your-secret-key-destiny-phinma-coc-2024';

export interface UserSession {
  id: number;
  school_id: string;
  fname: string;
  lname: string;
  mname: string;
  suffix: string;
  extension: string;
  status: number;
  isAuthenticated: boolean;
}

class SessionManager {
  private encrypt(data: UserSession): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  }

  private decrypt(encryptedData: string): UserSession | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch {
      return null;
    }
  }

  setSession(data: UserSession): void {
    const encryptedData = this.encrypt(data);
    sessionStorage.setItem('userSession', encryptedData);
  }

  getSession(): UserSession | null {
    const encryptedData = sessionStorage.getItem('userSession');
    if (!encryptedData) return null;

    const decryptedData = this.decrypt(encryptedData);
    return decryptedData;
  }

  clearSession(): void {
    sessionStorage.removeItem('userSession');
  }

  isAuthenticated(): boolean {
    const session = this.getSession();
    return !!session?.isAuthenticated;
  }

  getRole(): string {
    const session = this.getSession();
    return session?.status === 1 ? 'admin' : 'user';
  }

  getUserId(): number | null {
    const session = this.getSession();
    return session?.id || null;
  }

  getUsername(): string | null {
    const session = this.getSession();
    return session ? `${session.fname} ${session.lname}` : null;
  }

  getSchoolId(): string | null {
    const session = this.getSession();
    return session?.school_id || null;
  }
}

export const sessionManager = new SessionManager();

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
      if (!decryptedString) {
        console.error('SessionManager: Failed to decrypt session data - empty decrypted string');
        return null;
      }
      const parsed = JSON.parse(decryptedString);
      console.log('SessionManager: Successfully decrypted session:', parsed);
      return parsed;
    } catch (error) {
      console.error('SessionManager: Failed to decrypt session data:', error);
      return null;
    }
  }

  setSession(data: UserSession): void {
    console.log('SessionManager: Setting session with data:', data);
    const encryptedData = this.encrypt(data);
    sessionStorage.setItem('userSession', encryptedData);
    console.log('SessionManager: Session stored in sessionStorage');
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
    const isAuth = !!session?.isAuthenticated;
    console.log('SessionManager: isAuthenticated check:', { session, isAuth });
    return isAuth;
  }

  getRole(): string {
    const session = this.getSession();
    const role = session?.status === 1 ? 'admin' : 'user';
    console.log('SessionManager: getRole check:', { session, status: session?.status, role });
    return role;
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

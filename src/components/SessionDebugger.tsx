import React from 'react';
import { sessionManager } from '../utils/sessionManager';

export const SessionDebugger: React.FC = () => {
  const session = sessionManager.getSession();
  const isAuthenticated = sessionManager.isAuthenticated();
  const role = sessionManager.getRole();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px',
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h3>Session Debug Info</h3>
      <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Session Data:</strong></p>
      <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
        {JSON.stringify(session, null, 2)}
      </pre>
      <p><strong>Raw Session Storage:</strong></p>
      <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
        {sessionStorage.getItem('userSession') || 'No session data'}
      </pre>
    </div>
  );
};

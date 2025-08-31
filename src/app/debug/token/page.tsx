"use client"

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

export default function DebugTokenPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only show in non-production to avoid exposing tokens in public builds
    if (process.env.NODE_ENV === 'production') {
      setError('Debug page disabled in production');
      return;
    }

    async function load() {
      try {
        if (!auth) {
          setError('Firebase auth not initialized');
          return;
        }

        const user = auth.currentUser;
        if (!user) {
          setError('No authenticated user found. Please sign in first.');
          return;
        }

        setUid(user.uid);
        const idToken = await user.getIdToken();
        setToken(idToken);
      } catch (err: any) {
        console.error('Failed to get idToken:', err);
        setError(String(err?.message || err));
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Debug: Auth token</h1>
      {error ? (
        <div style={{ color: 'crimson' }}>{error}</div>
      ) : (
        <div>
          <p><strong>UID:</strong> {uid || '—'}</p>
          <p><strong>ID Token:</strong></p>
          <textarea readOnly value={token || ''} rows={8} style={{ width: '100%' }} />
          <div style={{ marginTop: 8 }}>
            <button
              onClick={() => navigator.clipboard.writeText(token || '')}
              disabled={!token}
            >
              Copy token to clipboard
            </button>
          </div>
          <p style={{ marginTop: 12, color: '#666' }}>
            Use this token for debugging server endpoints (Authorization: Bearer &lt;token&gt;).
            Remember to remove this page or protect it before deploying publicly.
          </p>
        </div>
      )}
    </div>
  );
}

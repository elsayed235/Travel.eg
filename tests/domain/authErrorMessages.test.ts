import { describe, it, expect } from 'vitest';
import { humanizeAuthError } from '../../src/lib/authErrorMessages';

describe('humanizeAuthError (§6a)', () => {
  const codeFor = (code: string) => ({ code });

  it('turns Firebase credential errors into a friendly bilingual message', () => {
    for (const code of ['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential']) {
      const en = humanizeAuthError(codeFor(code), 'en');
      const ar = humanizeAuthError(codeFor(code), 'ar');
      expect(en).toContain("doesn't look right");
      expect(ar).toContain('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  });

  it('maps email-already-in-use to the sign-in hint', () => {
    expect(humanizeAuthError(codeFor('auth/email-already-in-use'), 'en')).toContain('already exists');
    expect(humanizeAuthError(codeFor('auth/email-already-in-use'), 'ar')).toContain('مسجل بالفعل');
  });

  it('maps weak-password / popup-closed / network / rate-limit codes', () => {
    expect(humanizeAuthError(codeFor('auth/weak-password'), 'en')).toContain('at least 6 characters');
    expect(humanizeAuthError({ code: 'auth/popup-closed-by-user' }, 'ar')).toContain('تم إغلاق نافذة');
    expect(humanizeAuthError({ code: 'auth/network-request-failed' }, 'en')).toContain('Network');
    expect(humanizeAuthError({ code: 'auth/too-many-requests' }, 'ar')).toContain('محاولات كثيرة');
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(humanizeAuthError(new Error('anything else'), 'en')).toContain('temporarily unavailable');
    expect(humanizeAuthError('todo', 'ar')).toContain('تعذر إتمام العملية');
    expect(humanizeAuthError(undefined, 'en')).toContain('temporarily unavailable');
  });

  it('defaults to English when no language is given', () => {
    expect(humanizeAuthError(codeFor('auth/user-not-found'))).toContain("doesn't look right");
  });

  it('treats unknown message strings (e.g. our own API constants) as a fallback', () => {
    expect(humanizeAuthError({ message: 'AUTH_INVALID_CREDENTIALS' }, 'en')).toContain('temporarily unavailable');
  });
});
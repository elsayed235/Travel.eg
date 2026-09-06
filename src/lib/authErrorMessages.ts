/**
 * Auth error humanization, separated from the Firebase SDK bundle.
 *
 * The previous home of this function (src/lib/firebase.ts) lived inside the
 * 736KB vendor-firebase chunk. Any component that statically imported it —
 * most importantly AuthView.tsx — pulled the entire Firebase SDK into the
 * auth route chunk on first paint, even on a deployment where Firebase Admin
 * has no credentials and federated sign-in returns 503.
 *
 * This module has zero Firebase dependencies. It is a pure function over the
 * error shape Firebase (and our own email/password paths) produce, so it can
 * be imported anywhere without dragging the SDK along.
 */

import { translate, type Language } from '../i18n/translations';

export type AuthLang = Language;

export function humanizeAuthError(
  error: unknown,
  lang: AuthLang = 'en'
): string {
  const code =
    typeof error === 'object' && error != null
      ? (String((error as { code?: unknown }).code ?? (error as { message?: unknown }).message ?? ''))
      : '';

  if (
    code.includes('user-not-found') ||
    code.includes('wrong-password') ||
    code.includes('invalid-credential')
  ) {
    return translate('auth.invalidCredentials', lang);
  }

  if (code.includes('email-already-in-use')) {
    return translate('auth.emailInUse', lang);
  }

  if (code.includes('weak-password')) {
    return translate('auth.weakPassword', lang);
  }

  if (
    code.includes('popup-closed-by-user') ||
    code.includes('cancelled-popup-request')
  ) {
    return translate('auth.popupClosed', lang);
  }

  if (code.includes('network-request-failed')) {
    return translate('auth.networkIssue', lang);
  }

  if (code.includes('too-many-requests')) {
    return translate('auth.tooManyAttempts', lang);
  }

  return translate('auth.temporarilyUnavailable', lang);
}

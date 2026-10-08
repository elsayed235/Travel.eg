import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  DEFAULT_DESTINATION,
  DESTINATIONS,
  isDestinationId,
  type Destination,
  type DestinationId,
} from '../design/destinations';
import { useTheme } from './ThemeContext';

/**
 * The destination the visitor is exploring. It is part of the identity, not
 * a filter: switching it re-tints and re-paces the whole product
 * (tokens.css, data-destination) and scopes catalogue screens.
 *
 * Resolution order: `?d=` in the URL (shareable links), the saved choice,
 * then Dahab. index.html applies the same read before first paint so the
 * page never flashes the wrong palette.
 */

const STORAGE_KEY = 'rehla_destination';

function readInitial(): DestinationId {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('d');
    if (isDestinationId(fromUrl)) return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isDestinationId(saved)) return saved;
  } catch {
    // storage or URL unavailable: the default stands
  }
  return DEFAULT_DESTINATION;
}

interface DestinationContextValue {
  destinationId: DestinationId;
  destination: Destination;
  /** Switch place. Cross-fades the document where the browser supports it. */
  setDestination: (id: DestinationId) => void;
}

const DestinationContext = createContext<DestinationContextValue | undefined>(undefined);

export const DestinationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinationId, setDestinationId] = useState<DestinationId>(readInitial);
  const { themeId, reducedMotion } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-destination', destinationId);
    try {
      localStorage.setItem(STORAGE_KEY, destinationId);
    } catch {
      // per-run only
    }
    const d = DESTINATIONS[destinationId];
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && themeId !== 'high-contrast-pro') meta.setAttribute('content', themeId === 'salt' ? d.chrome.salt : d.chrome.abyss);
  }, [destinationId, themeId]);

  const setDestination = useCallback(
    (id: DestinationId) => {
      if (id === destinationId) return;
      const apply = () => flushSync(() => setDestinationId(id));
      const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
      if (!reducedMotion && typeof doc.startViewTransition === 'function') {
        doc.startViewTransition(apply);
      } else {
        apply();
      }
    },
    [destinationId, reducedMotion],
  );

  const value = useMemo(
    () => ({ destinationId, destination: DESTINATIONS[destinationId], setDestination }),
    [destinationId, setDestination],
  );

  return <DestinationContext.Provider value={value}>{children}</DestinationContext.Provider>;
};

export const useDestination = (): DestinationContextValue => {
  const ctx = useContext(DestinationContext);
  if (!ctx) throw new Error('useDestination must be used within a DestinationProvider');
  return ctx;
};

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { TRANSLATIONS } from '../../src/i18n/translations';

/**
 * Emoji discipline gate.
 *
 * The UI-icon sweep (Phase 1) replaced every color-emoji-as-icon with the
 * Lucide `CategoryIcon` primitive. Color emoji are banned in `src/`: they
 * render inconsistently across platforms, ignore the theme palette, and
 * break the Luxury Re-Skin glyph language. The typographic dingbats ★ ☆ ☐
 * ☑ ☒ (monochrome text glyphs that inherit color) remain allowed; the
 * VS16 variation selector is banned because it forces emoji presentation.
 */

const COLOR_EMOJI = /[\u{1F000}-\u{1FAFF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2600}-\u{26FF}]/u;
// Monochrome typographic glyphs that stay legal: ★ ☆ ☐ ☑ ☒
const ALLOWED_DINGBATS = /[\u{2605}\u{2606}\u{2610}\u{2611}\u{2612}]/u;

function collectSourceFiles(dir: string, out: string[]): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === 'data' || entry.startsWith('.')) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) collectSourceFiles(p, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(p);
  }
  return out;
}

describe('emoji discipline', () => {
  it('keeps color emoji out of src/ code', () => {
    const offenders: string[] = [];
    for (const file of collectSourceFiles(join(process.cwd(), 'src'), [])) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        const cleaned = line.replace(ALLOWED_DINGBATS, '');
        if (COLOR_EMOJI.test(cleaned)) offenders.push(`${file}:${i + 1} ${line.trim().slice(0, 80)}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('keeps color emoji out of user-facing translations', () => {
    const offenders = Object.entries(TRANSLATIONS)
      .filter(([, v]) => COLOR_EMOJI.test(v.en) || COLOR_EMOJI.test(v.ar))
      .map(([k, v]) => `${k} -> ${v.en} / ${v.ar}`);
    expect(offenders).toEqual([]);
  });
});
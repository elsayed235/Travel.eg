/**
 * Consistent backup of the SQLite store.
 *
 *   npm run db:backup
 *
 * The audit's finding was blunt: there was no backup mechanism at all.
 * snapshotService takes knowledge snapshots, not copies of the database.
 *
 * VACUUM INTO is used rather than a file copy because it runs in a transaction:
 * it cannot capture a page mid-write, and it works while the server is running.
 * Copying dahab.sqlite by hand while a writer is active can produce a file that
 * looks fine and is torn — and in WAL mode it also silently leaves the -wal
 * file behind, so the copy is missing the most recent commits.
 */
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { SQLITE_FILE, backupDir } from '../paths';

const SOURCE = SQLITE_FILE();
const BACKUP_DIR = backupDir();

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`No database at ${SOURCE}. Run: npm run db:migrate`);
    process.exit(1);
  }
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const target = path.join(BACKUP_DIR, `dahab-${stamp}.sqlite`);

  const sqlite = new Database(SOURCE, { readonly: true });
  sqlite.prepare('VACUUM INTO ?').run(target);
  sqlite.close();

  // Verify the copy opens and passes its own integrity check before reporting
  // success. A backup nobody has opened is a hope, not a backup.
  const verify = new Database(target, { readonly: true });
  const ok = verify.pragma('integrity_check', { simple: true });
  const rows = verify.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  verify.close();

  if (ok !== 'ok') {
    console.error(`Backup wrote to ${target} but failed integrity_check: ${ok}`);
    process.exit(1);
  }

  const size = fs.statSync(target).size;
  console.log(`${target}`);
  console.log(`  ${(size / 1048576).toFixed(2)} MB · integrity ok · ${rows.n} users`);

  const kept = fs
    .readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sqlite'))
    .sort();
  console.log(`  ${kept.length} backup(s) in ${BACKUP_DIR}`);
}

main();

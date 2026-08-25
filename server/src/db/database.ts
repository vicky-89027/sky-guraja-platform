import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: SqlJsDatabase | null = null;
const DB_DIR = path.resolve(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'sky_guraja.sqlite');

export async function getDatabase(): Promise<SqlJsDatabase> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const filebuffer = fs.readFileSync(DB_PATH);
    dbInstance = new SQL.Database(filebuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  // Enable foreign keys
  dbInstance.run('PRAGMA foreign_keys = ON;');
  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

export class DB {
  static async query<T = any>(sqlStr: string, params: any[] = []): Promise<T[]> {
    const db = await getDatabase();
    const stmt = db.prepare(sqlStr);
    stmt.bind(params);
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    return results;
  }

  static async get<T = any>(sqlStr: string, params: any[] = []): Promise<T | null> {
    const rows = await DB.query<T>(sqlStr, params);
    return rows.length > 0 ? rows[0] : null;
  }

  static async run(sqlStr: string, params: any[] = []): Promise<{ changes: number }> {
    const db = await getDatabase();
    db.run(sqlStr, params);
    saveDatabase();
    return { changes: db.getRowsModified() };
  }

  static async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const db = await getDatabase();
    db.run('BEGIN TRANSACTION;');
    try {
      const result = await callback();
      db.run('COMMIT;');
      saveDatabase();
      return result;
    } catch (error) {
      db.run('ROLLBACK;');
      throw error;
    }
  }

  static async exec(sqlStr: string): Promise<void> {
    const db = await getDatabase();
    db.exec(sqlStr);
    saveDatabase();
  }
}

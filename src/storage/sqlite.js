import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export class SQLiteStorage {
  constructor(dbPath) {
    // Ensure the directory for the database exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // for better concurrency
    this.initSchema();
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        tags TEXT,                    -- JSON array stored as text
        semantic_keywords TEXT,       -- AI-generated keywords for search
        importance INTEGER DEFAULT 5,
        project TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_project ON memories(project);
      CREATE INDEX IF NOT EXISTS idx_importance ON memories(importance DESC);
      CREATE INDEX IF NOT EXISTS idx_created_at ON memories(created_at DESC);

      -- Full-text search table
      CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
        content,
        semantic_keywords,
        content='memories',
        content_rowid='id'
      );

      -- Triggers to keep the FTS table in sync with the memories table
      CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
        INSERT INTO memories_fts(rowid, content, semantic_keywords) 
        VALUES (new.id, new.content, new.semantic_keywords);
      END;

      CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
        DELETE FROM memories_fts WHERE rowid = old.id;
      END;

      CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
        UPDATE memories_fts SET content = new.content, semantic_keywords = new.semantic_keywords WHERE rowid = old.id;
      END;
    `);
  }

  insertMemory({ content, tags, semanticKeywords, importance, project }) {
    const stmt = this.db.prepare(`
      INSERT INTO memories (content, tags, semantic_keywords, importance, project)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      content,
      JSON.stringify(tags || []),
      semanticKeywords,
      importance,
      project
    );
    return result.lastInsertRowid;
  }

  searchMemories({ query, project, limit = 20 }) {
    let sql = `
      SELECT m.* 
      FROM memories_fts fts
      JOIN memories m ON m.id = fts.rowid
      WHERE fts MATCH ?
    `;
    const params = [query];

    if (project) {
      sql += ` AND m.project = ?`;
      params.push(project);
    }

    sql += ` ORDER BY m.importance DESC, m.created_at DESC LIMIT ?`;
    params.push(limit);

    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  listProjects() {
    const stmt = this.db.prepare(`
      SELECT project, COUNT(*) as count
      FROM memories
      GROUP BY project
      ORDER BY project ASC
    `);
    return stmt.all();
  }

  getMemoriesByProject(project, limit = 10) {
    const stmt = this.db.prepare(`
      SELECT * FROM memories
      WHERE project = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(project, limit);
  }
}

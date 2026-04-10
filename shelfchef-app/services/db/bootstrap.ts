import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("shelfchef.db");

export const initDatabase = async () => {
  console.log("INITIALISING")
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS authors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      author_id INTEGER,
      FOREIGN KEY(author_id) REFERENCES authors(id)
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      page_number INTEGER,
      book_id INTEGER,
      prep_time TEXT,
      cook_time TEXT,
      total_time TEXT,
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY(book_id) REFERENCES books(id)
    );

    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      symbol TEXT
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER,
      name TEXT,
      quantity REAL,
      unit_id INTEGER,
      extra_detail TEXT,
      FOREIGN KEY(recipe_id) REFERENCES recipes(id),
      FOREIGN KEY(unit_id) REFERENCES units(id)
    );
  `);
};
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
      book_id INTEGER PRIMARY KEY AUTOINCREMENT, -- This is named book_id
      title TEXT,
      author_id INTEGER,
      FOREIGN KEY(author_id) REFERENCES authors(id),
      UNIQUE(title, author_id)
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
      -- FIX: Changed 'books(id)' to 'books(book_id)'
      FOREIGN KEY(book_id) REFERENCES books(book_id), 
      UNIQUE(name, book_id)
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER,
      name TEXT,
      quantity REAL,
      unit TEXT,
      extra_detail TEXT,
      FOREIGN KEY(recipe_id) REFERENCES recipes(id)
    );
  `);
};
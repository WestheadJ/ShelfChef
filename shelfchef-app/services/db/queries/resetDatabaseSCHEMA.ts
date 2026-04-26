import { initDatabase } from "../bootstrap";

export default async function resetDatabaseSCHEMA(db: any) {
    console.log("RESETTING");

    await db.execAsync(`
        PRAGMA foreign_keys = OFF;
        DROP TABLE IF EXISTS ingredients;
        DROP TABLE IF EXISTS units;
        DROP TABLE IF EXISTS recipes;
        DROP TABLE IF EXISTS books;
        DROP TABLE IF EXISTS authors;
        PRAGMA foreign_keys = ON;
    `);

    await initDatabase();
}

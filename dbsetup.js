import pkg from "sqlite3";
const sqlite3 = pkg.verbose();
const db = new sqlite3.Database('./data/holidays.db')

db.serialize(() => {
    db.run("CREATE TABLE config (id INTEGER PRIMARY KEY AUTOINCREMENT, allowanceDays INTEGER)");
});

db.close();
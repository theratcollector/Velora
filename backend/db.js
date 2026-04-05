//db.js with better-sqlite3

const Database = require('better-sqlite3');
const db = new Database('velora.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email TEXT UNIQUE NOT NULL

    );
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

function pushRefreshToken(token) {
    const stmt = db.prepare('INSERT INTO refresh_tokens (token) VALUES (?)');
    stmt.run(token);
}

function deleteRefreshToken(token) {
    const stmt = db.prepare('DELETE FROM refresh_tokens WHERE token = ?');
    stmt.run(token);
}

function getRefreshToken(token) {
    const stmt = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?');
    return stmt.get(token);
}

function createUser(username, hash, email) {
    const stmt = db.prepare('INSERT INTO users (username, hash, email) VALUES (?, ?, ?)');
    const info = stmt.run(username, hash, email);
    return getUserById(info.lastInsertRowid);
}

function getUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
}

function getUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
}

function getUserById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
}

module.exports = {
    getUserByEmail,
    createUser,
    getUserByUsername,
    getUserById,
    pushRefreshToken,
    deleteRefreshToken,
    getRefreshToken
};
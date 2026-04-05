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

db.exec(`
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by_user_id INTEGER NOT NULL,
        is_group BOOLEAN NOT NULL DEFAULT 0
    )`
);

db.exec(`
    CREATE TABLE IF NOT EXISTS chat_participants(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role TEXT NOT NULL DEFAULT 'member',
        left_at TIMESTAMP
    )`
);

function getChatById(id) {
    const stmt = db.prepare('SELECT * FROM chats WHERE id = ?');
    return stmt.get(id);
}

function createChat(name, created_by_user_id, is_group) {
    const stmt = db.prepare('INSERT INTO chats (name, created_by_user_id, is_group) VALUES (?, ?, ?)');
    const info = stmt.run(name, created_by_user_id, is_group);
    return getChatById(info.lastInsertRowid);
}

function addChatParticipant(chat_id, user_id, role = 'member') {
    const stmt = db.prepare('INSERT INTO chat_participants (chat_id, user_id, role) VALUES (?, ?, ?)');
    stmt.run(chat_id, user_id, role);
}

function getChatsForUser(user_id) {
    const stmt = db.prepare(`
        SELECT c.*, cp.role FROM chats c
        JOIN chat_participants cp ON c.id = cp.chat_id
        WHERE cp.user_id = ?
    `);
    return stmt.all(user_id);
}

function deleteRefreshToken(token) {
    const stmt = db.prepare('DELETE FROM refresh_tokens WHERE token = ?');
    stmt.run(token);
}

function getRefreshToken(token) {
    const stmt = db.prepare('SELECT * FROM refresh_tokens WHERE token = ?');
    return stmt.get(token);
}

function pushRefreshToken(token) {
    const stmt = db.prepare('INSERT INTO refresh_tokens (token) VALUES (?)');
    stmt.run(token);
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
    getRefreshToken,
    createChat,
    getChatById,
    addChatParticipant,
    getChatsForUser
};
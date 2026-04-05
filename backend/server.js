//Server.js
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const dotenv = require('dotenv');
const authenticateToken = require('./middleware/auth.js');
const {
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
} = require('./db.js');

const app = express();
app.use(express.json());
dotenv.config();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Running...');
});

//register
app.post("/auth/register", (req, res) => {
    const { username, password, email } = req.body;

    if(!username || !password || !email){
        return res.status(400).json({ message: "Username, password and email are required" });
    }

    if(getUserByEmail(email)){
        return res.status(400).json({ message: "Email already in use" });
    }

    if(getUserByUsername(username)){
        return res.status(400).json({ message: "Username already in use" });
    }

    const hashedPW = bcrypt.hashSync(password, 10);

    const user = createUser(username, hashedPW, email);
    res.status(201).json({ message: `User registered successfully`, id: user.id, username: user.username, email: user.email });
});

app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = getUserByUsername(username);

    if(!user){
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.hash);

    if(!passwordMatch){
        return res.status(400).json({ message: "Invalid username or password" });
    }

    const accessToken = jsonwebtoken.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jsonwebtoken.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    pushRefreshToken(refreshToken);

    res.status(200).json({ message: "Login successful", accessToken, refreshToken, id: user.id, username: user.username, email: user.email });
});    

app.post("/auth/logout", (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken){
        return res.status(400).json({ message: "Refresh token is required" });
    }

    deleteRefreshToken(refreshToken); 
    res.status(200).json({ message: "Logout successful" });
});

app.post("/auth/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if(!refreshToken){
        return res.status(400).json({ message: "Refresh token is required" });
    }

    const storedToken = getRefreshToken(refreshToken);

    if(!storedToken){
        return res.status(400).json({ message: "Invalid refresh token" });
    }

    try {
        const decoded = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.id;
        const user = getUserById(userId);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        const newAccessToken = jsonwebtoken.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(400).json({ message: "Invalid refresh token" });
    }
});

app.get("/auth/me", authenticateToken, (req, res) => {
    res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        created_at: req.user.created_at
    });
});

app.post("/chats", authenticateToken, (req, res) => {
    const user = req.user;
    console.log("getting chats for user", user.name, user.id, user.email, user.username);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
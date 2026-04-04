//Server.js
const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const {
    getUserByEmail,
    createUser,
    getUserByUsername,
    getUserById
} = require('./db.js');

const app = express();
app.use(express.json());
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (req, res) => {
  res.send('Running...');
});

//register
app.post("/register", (req, res) => {
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

app.post("/login", (req, res) => {
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

    const token = jsonwebtoken.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token, id: user.id, username: user.username, email: user.email });
});    

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
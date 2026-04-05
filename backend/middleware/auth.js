const jsonwebtoken = require('jsonwebtoken');
const { getUserById } = require('../db.js');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({ message: "No token provided" });
    }

    const parts = authHeader.split(' ');

    if(parts.length !== 2 || parts[0] !== 'Bearer'){
        return res.status(401).json({ message: "Invalid token format" });
    }

    try{
        const decoded = jsonwebtoken.verify(parts[1], process.env.JWT_ACCESS_SECRET);
        const user = getUserById(decoded.id);

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authenticateToken;
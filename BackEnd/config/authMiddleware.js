const jwt = require('jsonwebtoken');
const SECRET_KEY =process.env.SECRET_KEY; 

const authMiddleware = (req, res, next) => {
const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // const token = req.cookies.jwttoken;
    // if (!token) {
    //     return res.status(401).json({ message: 'No token, authorization denied' });
    // }


    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Step 2: Extract the token from the Authorization header
    const token = authHeader.split(' ')[1]; // 'Bearer <token>' => [Bearer, <token>]


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        req.user = decoded; // Store the decoded user data in req.user
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;

import jwt from 'jsonwebtoken';

export const verifyAccessToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access token missing or malformed' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
}
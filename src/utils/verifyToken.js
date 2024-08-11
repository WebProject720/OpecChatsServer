import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
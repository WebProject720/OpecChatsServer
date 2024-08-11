import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const createToken = (data = null) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
}
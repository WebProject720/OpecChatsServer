import { verifyToken } from "./verifyToken.js";


export const getCookie = async (socket) => {
    try {
        const cookie = (socket.handshake.headers?.cookie);
        if (!cookie) {
            io.emit('error-msg', { error: null, msg: "cookie not found", success: false })
            return { msg: "cookie not found" }
        }
        let string = cookie.slice(cookie.indexOf('=') + 1)
        const verify = verifyToken(string);
        if (!verify) {
            return {
                msg: 'Token not verify',
                success: false
            }
        }
        return {
            msg: 'User Verified',
            success: true,
            _id: verify?._id
        }
    } catch (error) {
        return { msg: 'server error', success: false }
    }
}
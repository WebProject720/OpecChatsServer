export const CookieOption = (production, bool = false) => {
    if (bool) {
        return {
            httpOnly: true,     // Cookie accessible only by web server
            secure: production,       // Cookie sent only over HTTPS
            sameSite: production ? 'None' : 'Lax', // Cookie sent only to the same site
            path: '/',
        }
    }
    return {
        httpOnly: true,     // Cookie accessible only by web server
        secure: production,       // Cookie sent only over HTTPS
        expires: new Date(Date.now() + 36000000),    // Cookie expiry time in milliseconds
        sameSite: production ? 'None' : 'Lax', // Cookie sent only to the same site
        path: '/',
    }
}
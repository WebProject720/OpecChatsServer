import 'dotenv/config'

export const googleLogin = async (req, res) => {
    try {

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID;
        const redirectUri = `http://localhost:3000/api/auth/callback`;
        const scope = encodeURIComponent('openid email profile');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

        res.redirect(authUrl);
    } catch (error) {
        console.log(error);

    }
}
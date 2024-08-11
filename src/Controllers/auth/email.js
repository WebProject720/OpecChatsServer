import { ApiError } from "../../utils/ApiError.js";


export const email = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json(new ApiError());
    }
}
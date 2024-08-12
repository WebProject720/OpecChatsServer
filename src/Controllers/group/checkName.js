import { Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js";

export const checkName = async (req, res) => {
    try {
        const { _id, name } = req.body;
        if (!(name && _id)) {
            return res
                .status(400)
                .json(
                    new ApiError('User and name required')
                )
        }
        const group = await Groups.findOne({ groupName: name })
        if (group) {
            return res
                .status(400)
                .json('Group name already Exits');
        }
        return res
            .status(200)
            .json('Group name is unique');

    } catch (error) {

    }
}
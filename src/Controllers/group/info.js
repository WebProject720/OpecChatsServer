import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Groups } from "../../Models/models.js";
import { Types } from "mongoose";
import { getGroup } from '../../components/getGroup.js';

export const GroupInfo = async (req, res) => {
    try {
        const { identifier, _id } = req.body;
        if (!_id) {
            return res.status(405).json(new ApiError('user not authenticated'))
        }
        if (!identifier) {
            return res.status(404).json(new ApiError('identifier required'))
        }

        const isID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        const findGroup = await getGroup(null,identifier)

        return res.status(200).json(
            new ApiResponse('group details', findGroup)
        )


    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }
}
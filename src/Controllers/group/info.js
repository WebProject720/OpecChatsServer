import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { getGroup } from '../../components/getGroup.js';

export const GroupInfo = async (req, res) => {
    try {
        const { identifier, _id } = req.body;
        if (!_id) {
            return res.status(405).json(new ApiError('Please Login !! Try again'))
        }
        if (!identifier) {
            return res.status(404).json(new ApiError('identifier required'))
        }

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
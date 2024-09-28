import { Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const searchGroup = async (req, res) => {
    const { q } = req.body;
    
    if (!q) {
        return res.status(404).json(
            new ApiError('Identifier must required', {}, false, 404)
        )
    }
    // const groups = await Groups.find({ $text: { $search: q } })
    const groups = await Groups.aggregate(
        [
            {
                $match:
                    { groupName: { $regex: q, $options: "i" } }
            },
            {
                $project: {
                    groupName: 1,
                    _id: 1,
                    isGroupPrivate: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
            {
                $sort: { updatedAt: -1 }
            }
        ]
    )

    return res.status(200).json(
        new ApiResponse('Available groups with given string', groups, true)
    )
}


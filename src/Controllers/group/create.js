import { Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'

export const createGroup = async (req, res) => {
    try {
        const {
            name,
            _id,
            image,
            type,
            memberLimit,
            bgImage,
            code
        } = req.body;

        if (!(name && _id)) {
            return res.status(400).json(
                new ApiError('Name and Admin Required')
            )
        }
        if (code !== type) {
            return res.status(400).json(
                new ApiError('Code Required for Private Group')
            )
        }
        const checkName = await Groups.findOne({ groupName: name });
        if (checkName) {
            return res
                .status(400)
                .json(
                    new ApiError('Group name already in use')
                )
        }

        const group = new Groups({
            groupName: name,
            profileImage: image,
            bgImage: bgImage,
            isGroupPrivate: type || false,
            admin: _id,
            memberAllowedAtSingleTime: memberLimit,
            uniqueCode: code || null
        });

        const response = await group.save();
        if (response) {
            return res
                .status(200)
                .json(
                    new ApiResponse('group created', { _id: response._id })
                )
        } else {
            return res
                .status(400)
                .json(
                    new ApiResponse('group not created', {})
                )
        }
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error', error)
        )
    }
}
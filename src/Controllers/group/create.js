import { Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'

export const createGroup = async (req, res) => {
    try {
        let {
            name,
            _id,
            type,
            memberLimit,
            bgImage,
            code,
            profileImage
        } = req.body;

        code = code?.trim();
        name = name?.trim();

        if (!(name && _id)) {
            return res.status(400).json(
                new ApiError('Name and Admin Required')
            )
        }
        if ((type == true && code == false) || (code == true && type == false)) {
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
            profileImage,
            bgImage: bgImage,
            isGroupPrivate: !(type.toLowerCase() == 'public'),
            admin: _id,
            memberAllowedAtSingleTime: memberLimit,
            uniqueCode: code || null
        });

        const response = await group.save();
        response.uniqueCode = null;

        if (response) {
            return res
                .status(200)
                .json(
                    new ApiResponse('group created', response)
                )
        } else {
            return res
                .status(400)
                .json(
                    new ApiResponse('group not created', {})
                )
        }
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError('Server Error', error)
        )
    }
}
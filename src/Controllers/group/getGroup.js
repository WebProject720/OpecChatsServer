import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { getBasicGroup } from "../../components/basicGroupD.js";
import { getGroup } from '../../components/getGroup.js'

export const getGroupDetails = async (req, res) => {
    try {
        const { _id, groupID, identifier } = req.body;

        if (!(groupID || identifier)) {
            return res.status(400).json(
                new ApiError('Group details must required', undefined, false)
            )
        }
        const group = await getBasicGroup(groupID, identifier)

        if (!group) {
            return res.status(404).json(
                new ApiError(
                    'Group not found',
                    undefined,
                    false
                )
            )
        }

        let flag = false;

        if (group?.isGroupPrivate) {

            flag = group.memberLists.some(element => element == _id) ||
                group?.TempMembers?.some(element => element == _id) ||
                group.permanentMember.some(element => element == _id) ||
                group.admin._id == _id;


            if (!flag && group?.isGroupPrivate) {
                return res.status(400).json(
                    new ApiError(
                        'Become a Group Member',
                        { canAccess: false },
                        false
                    )
                )
            }
        }

        const updatedGroup = await getGroup(group._id)
        return res.status(200).json(
            new ApiResponse('Group Data', updatedGroup, true)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError(
                'Server Error',
                error,
                false
            )
        )
    }
}
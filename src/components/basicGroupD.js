import { Types } from "mongoose";
import { Groups } from "../Models/group.model.js";

export async function getBasicGroup(groupID, identifier, options) {
    let op = {
        uniqueCode: 1,
        groupName: 1,
        isGroupPrivate: 1,
        TempMembers: 1,
        permanentMember: 1,
        memberLists: 1,
        admin: 1
    }
    if (options) {
        op = options
    }
    try {
        let group = await Groups.aggregate(
            [
                {
                    $match: {
                        $or: [{ _id: new Types.ObjectId(groupID) }, { groupName: identifier.trim() }]
                    }
                },
                {
                    $project: op
                }
            ]
        );

        group = group[0];
        return group
    } catch (error) {
        console.log(error);
        return false
    }
}
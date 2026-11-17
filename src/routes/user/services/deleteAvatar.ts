import {db} from "@/db.js";

import {deletePath} from "@composables/useDeletePath.js";

import {emptyUserDataException} from "@utils/httpExceptions.js";

export const deleteAvatar = async (
    id: number,
) => {
    const admin = await db.admin.findUnique({
        where: {
            id,
        },
        select: {
            avatarUrl: true,
        },
    })
    if (!admin?.avatarUrl) throw emptyUserDataException

    await db.admin.update({
        where: {
            id,
        },
        data: {
            avatarUrl: '',
        },
    })

    await deletePath(admin.avatarUrl)
}
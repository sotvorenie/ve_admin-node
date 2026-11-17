import {db} from "@/db.js";
import type {User} from "@/types/express.js";

import {createAvatar} from "@composables/useCreateAvatar.js";
import {deletePath} from "@composables/useDeletePath.js";

export const uploadAvatar = async (
    currentUser: User,
    avatarFile: Express.Multer.File,
) => {
    const url = await createAvatar(avatarFile, currentUser.id)

    await db.admin.update({
        where: {
            id: currentUser.id,
        },
        data: {
            avatarUrl: url,
        },
    })

    try {
        if (currentUser.avatarUrl) await deletePath(currentUser.avatarUrl)
    } catch {}

    return url
}
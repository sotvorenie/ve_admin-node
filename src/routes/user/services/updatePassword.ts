import bcrypt from "bcryptjs";
import {db} from "@/db.js";

import {duplicationPasswordException, invalidOldPasswordException, userException} from "@utils/httpExceptions.js";

export const updatePassword = async (
    id: number,
    password: string,
    oldPassword: string,
) => {
    const user = await db.admin.findUnique({
        where: {
            id,
        },
        select: {
            password: true,
        },
    })
    if (!user) throw userException

    const isOldValid = await bcrypt.compare(oldPassword, user.password)
    if (!isOldValid) throw invalidOldPasswordException

    const isSame: boolean = await bcrypt.compare(password, user.password)
    if (isSame) throw duplicationPasswordException

    const newPassword = await bcrypt.hash(password, 10)

    await db.admin.update({
        where: {
            id,
        },
        data: {
            password: newPassword,
            tokenVersion: {increment: 1},
        },
    })
}
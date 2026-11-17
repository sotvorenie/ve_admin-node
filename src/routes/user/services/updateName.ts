import {db} from "@/db.js";

export const updateName = async (
    userId: number,
    name: string,
) => {
    const formattedName = name.trim()

    await db.admin.update({
        where: {
            id: userId,
        },
        data: {
            name: formattedName,
        },
    })
}
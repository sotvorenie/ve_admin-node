import bcrypt from "bcryptjs";
import {db} from "@/db.js";

import {registrationException} from "@utils/httpExceptions.js";

import {userSelect} from "@/selects/userSelect.js";

export const register = async (
    login: string,
    password: string,
    name: string,
) => {
    const existingUser = await db.admin.findUnique({
        where: {
            login,
        },
        select: {
            id: true,
        },
    })
    if (existingUser) throw registrationException

    const hashedPassword = await bcrypt.hash(password, 10)

    return db.admin.create({
        data: {
            login,
            name: name.trim(),
            password: hashedPassword,
        },
        select: userSelect,
    })
}
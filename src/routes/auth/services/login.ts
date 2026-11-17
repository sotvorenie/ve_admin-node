import bcrypt from "bcryptjs";
import {db} from "@/db.js";

import {authException} from "@utils/httpExceptions.js";

import {userSelect} from "@/selects/userSelect.js";

export const logIn = async (
    login: string,
    password: string,
) => {
    const admin = await db.admin.findUnique({
        where: {
            login,
        },
        select: {
            ...userSelect,
            password: true,
        },
    })
    if (!admin) throw authException

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) throw authException

    const { password: _, ...adminWithoutPassword } = admin

    return adminWithoutPassword
}
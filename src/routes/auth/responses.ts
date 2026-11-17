import type {Response} from "express";
import type {User} from "@/types/express.js";

import {createJWTToken} from "@utils/auth.js";

export const authResponse = (
    res: Response,
    user: User,
    isRegister: boolean = false,
) => {
    const {tokenVersion, ...userForApp} = user

    return res.status(isRegister ? 201 : 200).json({
        user: userForApp,
        token: createJWTToken(user.id, user.tokenVersion),
    })
}
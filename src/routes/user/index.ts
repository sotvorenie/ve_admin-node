import {Router, type Response, type Request} from "express";
import bcrypt from "bcryptjs";
import multer from 'multer';
import path from "node:path";
import fs from "node:fs/promises";
import {db} from "@/db.js";

import {deleteAvatar, updateName, updatePassword, uploadAvatar} from "@routes/user/services/index.js";
import {schemas} from "@routes/user/schemas.js";

import {uploadStorage} from "@composables/useUploadStorage.js";

import {getUser} from "@utils/auth.js";
import {asyncHandler} from "@utils/asyncHandler.js";
import {emptyUserDataException} from "@utils/httpExceptions.js";

import {nameSchema} from "@/schemas/nameSchema.js";
import {passwordSchema} from "@/schemas/passwordSchema.js";

import {successResponse} from "@/responses/successResponse.js";

export const userRouter = Router();

userRouter.patch('/name', getUser(), asyncHandler(async (req: Request, res: Response) => {
    const {name} = nameSchema.parse(req.body)
    const currentUser = req.user!

    await updateName(currentUser.id, name)

    return successResponse(res)
}))

userRouter.patch('/password', getUser(), asyncHandler(async (req: Request, res: Response) => {
    const {password, old_password: oldPassword} = passwordSchema.extend(schemas.shape).parse(req.body)
    const currentUser = req.user!

    await updatePassword(currentUser.id, password, oldPassword)

    return successResponse(res)
}))

const upload = multer({storage: uploadStorage})
userRouter.post(
    '/avatar',
    getUser(),
    upload.fields([
        {name: 'avatar', maxCount: 1},
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const currentUser = req.user!

        const files = req.files as { [fieldname: string]: Express.Multer.File[] }
        const avatarFile = files?.avatar?.[0]

        if (!avatarFile) throw emptyUserDataException

        const newAvatarUrl = await uploadAvatar(currentUser, avatarFile)

        res.status(201).json({
            url: newAvatarUrl,
        })
    })
)

userRouter.delete('/avatar', getUser(), asyncHandler(async (req: Request, res: Response) => {
        const currentUser = req.user!

        await deleteAvatar(currentUser.id)

        return successResponse(res)
    })
)
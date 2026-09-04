import {Router, type Response, type Request} from "express";
import bcrypt from "bcryptjs";
import multer from 'multer';
import path from "node:path";
import fs from "node:fs/promises";
import {db} from "@/db.js";

import {ALLOWED_PHOTO_SUFFIX, AVATARS_DIRECTORY} from "@/config.js";

import {uploadStorage} from "@/composables/useUploadStorage.js";
import {createUrl} from "@/composables/useCreateUrl.js";

import {getUser} from "@utils/auth.js";
import {asyncHandler} from "@utils/asyncHandler.js";
import {duplicationPasswordException, emptyUserDataException, photoFormatException} from "@utils/httpExceptions.js";

import {nameSchema} from "@/schemas/nameSchema.js";
import {passwordSchema} from "@/schemas/passwordSchema.js";

import {successResponse} from "@/responses/successResponse.js";

export const userRouter = Router();

userRouter.patch('/redact_name', getUser(), asyncHandler(async (req: Request, res: Response) => {
    const {name} = nameSchema.parse(req.body)
    const currentUser = req.user!

    const formattedName = name.trim()
    if (!formattedName) throw emptyUserDataException

    if (currentUser.name !== formattedName) {
        await db.admin.update({
            where: {
                id: currentUser.id
            },
            data: {
                name: formattedName
            }
        })
    }

    return successResponse(res)
}))

userRouter.patch('/redact_password', getUser(), asyncHandler(async (req: Request, res: Response) => {
    const {password} = passwordSchema.parse(req.body)
    const currentUser = req.user!

    const formattedPassword = password.trim()
    if (!formattedPassword) throw emptyUserDataException

    const check = await bcrypt.compare(password, formattedPassword)
    if (check) throw duplicationPasswordException

    const newPassword = await bcrypt.hash(formattedPassword, 10)

    await db.admin.update({
        where: {
            id: currentUser.id
        },
        data: {
            password: newPassword
        }
    })

    return successResponse(res)
}))

const upload = multer({storage: uploadStorage})
userRouter.post(
    '/upload_avatar',
    getUser(),
    upload.fields([
        {name: 'avatar', maxCount: 1},
    ]),
    asyncHandler(async (req: Request, res: Response) => {
        const currentUser = req.user!

        const files = req.files as { [fieldname: string]: Express.Multer.File[] }
        const avatarFile = files?.avatar?.[0]

        if (!avatarFile) throw emptyUserDataException

        const avatarSuffix = path.extname(avatarFile.originalname).toLowerCase()
        if (!ALLOWED_PHOTO_SUFFIX.has(avatarSuffix)) throw photoFormatException

        let targetAvatarPath: string | null = null

        try {
            req.checkAborted()

            await fs.mkdir(AVATARS_DIRECTORY, {recursive: true})

            req.checkAborted()

            targetAvatarPath = path.join(AVATARS_DIRECTORY, `${currentUser.id}_${Date.now()}${avatarSuffix}`)
            await fs.rename(avatarFile.path, targetAvatarPath)

            req.checkAborted()

            const newAvatarUrl = createUrl(targetAvatarPath)
            await db.admin.update({
                where: {
                    id: currentUser.id
                },
                data: {
                    avatarUrl: newAvatarUrl
                }
            })

            req.checkAborted()

            if (currentUser.avatarUrl) {
                const oldAvatarName = currentUser.avatarUrl.replace('/static', '')
                const oldAvatarPath = path.join(AVATARS_DIRECTORY, oldAvatarName)

                try {
                    await fs.unlink(oldAvatarPath)
                } catch (err: any) {
                    if (err.code === 'ENOENT') {
                        console.log('Старый файл аватарки не найден, пропускаем удаление')
                    } else {
                        console.error('Ошибка при удалении аватарки:', err)
                    }
                }
            }

            res.status(201).json({
                url: newAvatarUrl,
            })
        } catch (err) {
            if (targetAvatarPath) await fs.unlink(targetAvatarPath).catch()

            await fs.unlink(files?.avatar?.[0]?.path ?? '').catch()

            throw err
        }
    })
)
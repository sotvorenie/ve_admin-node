import path from "node:path";
import fs from "node:fs/promises";
import sharp from 'sharp';

import {ALLOWED_PHOTO_SUFFIX, AVATARS_DIRECTORY} from "@/config.js";

import {createUrl} from "@composables/useCreateUrl.js";
import {deletePath} from "@composables/useDeletePath.js";

import {photoFormatException} from "@utils/httpExceptions.js";

export const createAvatar = async (
    file: Express.Multer.File,
    id: number,
) => {
    const avatarSuffix = path.extname(file.originalname).toLowerCase()
    if (!ALLOWED_PHOTO_SUFFIX.has(avatarSuffix)) throw photoFormatException

    let targetAvatarPath: string | null = null

    try {
        await fs.mkdir(AVATARS_DIRECTORY, {recursive: true})

        targetAvatarPath = path.join(AVATARS_DIRECTORY, `${id}_${Date.now()}.webp`)

        await sharp(file.path)
            .resize(320, 320, {
                fit: "cover",
                withoutEnlargement: true,
            })
            .webp({quality: 80})
            .toFile(targetAvatarPath)

        return createUrl(targetAvatarPath)
    } catch (err) {
        if (targetAvatarPath) await deletePath(targetAvatarPath)
        throw err
    }
}
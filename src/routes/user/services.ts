import path from "node:path";
import fs from "node:fs/promises";

import {AVATARS_DIRECTORY} from "@/config.js";

export const deleteOldAvatar = async (avatarUrl: string) => {
    const oldAvatarName = avatarUrl.replace('/static', '')
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
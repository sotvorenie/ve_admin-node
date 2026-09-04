import path from "node:path";

export const BASE_STORAGE_DIR = path.resolve(process.env.BASE_STORAGE_DIR as string)
export const TEMPORARY_DIRECTORY = path.join(BASE_STORAGE_DIR, 'temporary')
export const AVATARS_DIRECTORY = path.join(BASE_STORAGE_DIR, 'users_avatars')

export const ALLOWED_PHOTO_SUFFIX = new Set(['.jpg', '.jpeg', '.png', '.webp'])
// создаем url для элемента БД из его пути Windows

import path from "node:path";

import {BASE_STORAGE_DIR} from "@/config.js";

export const createUrl = (filePath: string): string => {
    if (!filePath) return ''
    const relativePath = path.relative(BASE_STORAGE_DIR, filePath)
    const normalizedPath = relativePath.split(path.sep).join('/')
    return `/static/${normalizedPath}`
}
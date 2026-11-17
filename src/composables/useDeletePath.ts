import path from "node:path";
import fs from "node:fs/promises";

import { BASE_STORAGE_DIR } from "@/config.js";

export const deletePath = async (
    url: string | undefined | null,
) => {
    if (!url) return
    let fullPath = url

    if (url.startsWith('/static')) {
        const formattedUrl = url.replace('/static', '')
        fullPath = path.join(BASE_STORAGE_DIR, formattedUrl)
    }

    await fs.rm(fullPath, { recursive: true, force: true })
}
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';

import { TEMPORARY_DIRECTORY } from '@/config.js';

export const uploadStorage = multer.diskStorage({
    destination: async (_, __, cb) => {
        try {
            await fs.mkdir(TEMPORARY_DIRECTORY, { recursive: true })
            cb(null, TEMPORARY_DIRECTORY);
        } catch (err) {
            cb(err as Error, TEMPORARY_DIRECTORY);
        }
    },
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})
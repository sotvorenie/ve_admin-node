import {Router, type Request, type Response} from "express";

import {getUser} from "@utils/auth.js";
import {asyncHandler} from "@utils/asyncHandler.js";

export const checkRouter = Router();

checkRouter.get("/", getUser(), asyncHandler(async (_: Request, res: Response) => {
    res.json({
        success: true,
    })
}))
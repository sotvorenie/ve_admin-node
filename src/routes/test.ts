import {Router, type Request, type Response} from "express";
import {asyncHandler} from "@utils/asyncHandler.js";

export const testRouter = Router()

testRouter.get("/", asyncHandler(async (_: Request, res: Response) => {
    res.json({
        status: 'Сервер жив :)'
    })
}))

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan';

import {authRouter} from "@routes/auth.js";
import {checkRouter} from "@routes/check.js";
import {userRouter} from "@routes/user.js";

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use('/api/auth', authRouter)
app.use('/api/check', checkRouter)
app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
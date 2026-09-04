import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import {authRouter} from "@routes/auth.js";
import {checkRouter} from "@routes/check.js";

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/check', checkRouter)

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`)
})
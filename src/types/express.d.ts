interface User {
    id: number
    name: string
    login: string
    password: string
}

declare global {
    namespace Express {
        interface Request {
            user?: User
            checkAborted: () => boolean | never
            signal: AbortSignal
            aborted: boolean
        }
    }
}

export {}
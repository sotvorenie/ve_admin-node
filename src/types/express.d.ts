export interface User {
    id: number
    name: string
    login: string
    password: string
    avatarUrl?: string
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
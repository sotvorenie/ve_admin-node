export interface User {
    id: number
    name: string
    login: string
    password: string
    avatarUrl?: string | null
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
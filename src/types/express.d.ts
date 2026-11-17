export interface User {
    id: number
    name: string
    login: string
    avatarUrl: string | null
    tokenVersion: number
}

declare global {
    namespace Express {
        interface Request {
            user?: User
            abortController: AbortController
            checkAborted: () => void
        }
    }
}
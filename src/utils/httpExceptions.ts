export class AppError extends Error {
    status: number
    detail: string

    constructor(status: number, detail: string) {
        super(detail);
        this.status = status;
        this.detail = detail;
        this.name = 'AppError';
    }
}
export const HttpError = (status: number, detail: string) => {
    return new AppError(status, detail)
}

// база данных
export const dbException = HttpError(500, "Ошибка БД");

// авторизация и токен
export const jwtException = HttpError(401, "Не удалось валидировать токен");
export const registrationException = HttpError(409, "Пользователь с таким логином уже существует");
export const authException = HttpError(401, "Неверное имя или пароль");

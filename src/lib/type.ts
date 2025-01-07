// lib/type.ts
export interface SessionData {
    userId?: string
    username?: string
    firstname?: string
    lastname?: string
    isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 60 * 60 * 24 
    }
}

export type SessionOptions = {
    password: string
    cookieName: string
    cookieOptions: {
        httpOnly: true
        secure: boolean
        sameSite: "strict" | "lax" | "none";
        maxAge?: number;
    }
}


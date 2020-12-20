
export const setJwtInSession = ( session: CookieSessionInterfaces.CookieSessionObject | null | undefined, tokenJWT: string) => {
    session = {
        jwt: tokenJWT
    }
}
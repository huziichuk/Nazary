export type JwtAccessPayloadType = {
    userId: string;
}

export type JwtRefreshPayloadType = {
    userId: string;
    token: string;
    sessionId: string;
}
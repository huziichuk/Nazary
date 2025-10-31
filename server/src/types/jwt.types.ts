export type JwtAccessPayloadType = {
	id: string;
	email: string;
	name: string;
	createdAt: string;
	salt: string;
	sessionId: string;
};

export type JwtRefreshPayloadType = {
	id: string;
	email: string;
	token: string;
	sessionId: string;
	salt: string;
};

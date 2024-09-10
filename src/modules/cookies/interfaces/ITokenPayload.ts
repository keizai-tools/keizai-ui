export interface ITokenPayload {
  sub: string;
  email_verified: boolean;
  iss: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

export interface ITokenPayloadCognito extends ITokenPayload {
  'cognito:username': string;
}

export interface RegisterDTO {
  name: string,
  email: string,
  password: string
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface JWTPayload{
    id: number,
    name: string,
    email: string
}
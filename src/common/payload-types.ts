export enum LoginType { Signin, Signup }
export type LoginSubmitPayload = {
  type: LoginType
  email: string
  password: string
}
export type UserProfile = { email: string, id: string }

import { LoginSubmitPayload, UserProfile } from '../common/payload-types'
import { errorMsgFromRes, Result } from './common'

export type AuthResult = Result & { authorized: boolean }
export type SigninResult = Result
export type ProfileResult = Result & { profile?: UserProfile }
export type LogoutResult = Result

export default class LoginUpdater {
  constructor(
    private _signinURL: string,
    private _authURL: string,
    private _profileURL: string,
    private _logoutURL: string) { }

  async submitSignin(payload: LoginSubmitPayload): Promise<SigninResult> {
    const json = JSON.stringify(payload)
    let res
    try {
      res = await fetch(this._signinURL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: json
      })
      return res.ok
        ? { success: true }
        : {
          success: false,
          errorMessage: await errorMsgFromRes(res, 'Signin')
        }
    } catch (err) {
      console.error(err)
      return { success: false, errorMessage: err.message }
    }
  }

  async checkAuth(): Promise<AuthResult> {
    let res
    try {
      res = await fetch(this._authURL, {
        method: 'GET',
        credentials: 'include'
      })
      return { success: true, authorized: res.status === 200 }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        authorized: false,
        errorMessage: `Looks like the server is down (${err.message}).`
      }
    }
  }

  async fetchProfile(): Promise<ProfileResult> {
    let res
    try {
      res = await fetch(this._profileURL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Looks like the server is down (${err.message}).`
      }
    }
    if (!res.ok) {
      return {
        success: false,
        errorMessage: await errorMsgFromRes(res, 'Profile')
      }
    }
    try {
      return { success: true, profile: await res.json() }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Couldn't read user profile (${err.message}).`
      }
    }
  }

  async logout(): Promise<LogoutResult> {
    try {
      await fetch(this._logoutURL, {
        method: 'GET',
        credentials: 'include'
      })
      return { success: true }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Looks like the server is down (${err.message}).`
      }
    }
  }
}

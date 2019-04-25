import { errorMsgFromRes, Result } from './common'

export type HashtagsResult = Result & {
  hashtags?: string[]
}
export default class HashtagsUpdater {
  constructor(
    private _hashtagsURL: string
  ) { }

  async fetchHashtags(): Promise<HashtagsResult> {
    let res
    try {
      res = await fetch(this._hashtagsURL, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
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
        errorMessage: await errorMsgFromRes(res, 'Hashtags')
      }
    }
    try {
      const hashtags = await res.json()
      return { success: true , hashtags }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Couldn't marker data (${err.message}).`
      }
    }
  }
}

import { errorMsgFromRes, Result } from './common'

export type UploadResult = Result
export type UpdateMetaResult = Result

export default class ImageUpdater {
  constructor(
    private _uploadURL: string,
    private _updateURL: string
  ) { }

  async uploadFiles(files: File[]): Promise<UploadResult> {
    const formData = new FormData()
    for (const file of files) {
      formData.append('image', file)
    }
    try {
      const res = await fetch(this._uploadURL, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      return res.ok
        ? { success: true }
        : {
          success: false,
          errorMessage: await errorMsgFromRes(res, 'Image Upload')
        }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Looks like the server is down (${err.message}).`
      }
    }
  }

  async updateMetadata(payload:
    | { id: string, title: string }
    | { id: string, description: string }
    | { id: string, hashtags: string[] }
  ): Promise<UpdateMetaResult> {
    let res
    try {
      const json = JSON.stringify(payload)
      res = await fetch(this._updateURL, {
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
          errorMessage: await errorMsgFromRes(res, 'Update Metadata')
        }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Looks like the server is down (${err.message}).`
      }
    }
  }
}

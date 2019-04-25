import { ImageMetadata, LatLng } from '../common/image-types'
import { MapMarker } from '../components/Map'

import { errorMsgFromRes, Result } from './common'

export type MarkerResult = Result & {
  markerMap?: Map<string, MapMarker>
}

function determinePosition(imageMeta: ImageMetadata): MapMarker | null {
  if (imageMeta.position == null ||
    imageMeta.position.length === 0) {
    return null
  }
  try {
    const position = JSON.parse(imageMeta.position)
    return {
      ...imageMeta,
      position: new LatLng(position.lat, position.lng),
      visible: true
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export default class MarkerUpdater {
  constructor(
    private _serverRoot: string,
    private _imagesMetaURL: string
  ) { }

  _fullUrl(url: string): string {
    return `${this._serverRoot}${url}`
  }

  async fetchMarkers(hashtagFilter: string | null = null)
    : Promise<MarkerResult> {
    let res
    const url = hashtagFilter == null
      ? this._imagesMetaURL
      : `${this._imagesMetaURL}/${hashtagFilter}`
    try {
      res = await fetch(url, {
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
        errorMessage: await errorMsgFromRes(res, 'Markers')
      }
    }

    let imageMeta: ImageMetadata[]
    try {
      imageMeta = await res.json()
    } catch (err) {
      console.error(err)
      return {
        success: false,
        errorMessage: `Couldn't marker data (${err.message}).`
      }
    }

    const markerMap: Map<string, MapMarker> = imageMeta
      .reduce((map, x) => {

        const positionedMarker = determinePosition(x)
        // ignore markers whose position is not present or in an invalid format
        if (positionedMarker == null) return map
        map.set(x.id, {
          ...positionedMarker,
          imageUrl: this._fullUrl(x.imageUrl),
          imageThumbUrl: this._fullUrl(x.imageThumbUrl),
          imageThumbMediumUrl: this._fullUrl(x.imageThumbMediumUrl),
          imageThumbLargeUrl: this._fullUrl(x.imageThumbLargeUrl)
        })
        return map
      }, new Map())

    return { success: true, markerMap }
  }
}

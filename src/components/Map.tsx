import React, { Component } from 'react'
import ReactMapGL, {
  Marker,
  ViewState
} from 'react-map-gl'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import { ImageMetadata, LatLng } from '../common/image-types'

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Override<T, U> = Omit<T, keyof U> & U

const styles: StyleRulesCallback = _ => ({
  markerImage: {
    cursor: 'pointer'
  }
})

export enum ThumbSize { Small, Medium, Large }
export type MapMarker = Override<ImageMetadata, {
  position: LatLng
}> & { visible: boolean }

export type OnMarkerClicked = (id: string) => void
export type OnMapViewportChange = (viewState: ViewState) => void
export type MapProps = {
  markers: MapMarker[]
  mapCenter: LatLng,
  mapZoom: number,
  mapBearing?: number
  mapPitch?: number
  mapAltitude?: number
  thumbSize: ThumbSize,
  mapboxAccessToken: string
  onMarkerClicked: OnMarkerClicked
  onMapViewportChange: OnMapViewportChange
} & WithStyles<typeof styles>

class Map extends Component<MapProps> {
  render() {
    const {
      mapZoom,
      mapCenter,
      mapboxAccessToken,
      mapBearing,
      mapPitch,
      mapAltitude
    } = this.props
    const { lat, lng } = mapCenter
    return (
      <ReactMapGL
        width="100%"
        height="90vh"
        mapboxApiAccessToken={mapboxAccessToken}
        latitude={lat}
        longitude={lng}
        zoom={mapZoom}
        bearing={mapBearing}
        pitch={mapPitch}
        altitude={mapAltitude}
        onViewportChange={this._handleViewportChange}>
        {this._renderMarkers()}
      </ReactMapGL>
    )
  }

  _renderMarkers() {
    const { markers, thumbSize } = this.props
    return markers
      .filter(({ visible }) => visible)
      .map(({
        id,
        imageThumbUrl,
        imageThumbMediumUrl,
        imageThumbLargeUrl,
        position
      }) => {
        let thumbUrl
        switch (thumbSize) {
          case ThumbSize.Small:
            thumbUrl = imageThumbUrl
            break
          case ThumbSize.Medium:
            thumbUrl = imageThumbMediumUrl
            break
          case ThumbSize.Large:
            thumbUrl = imageThumbLargeUrl
            break
          default:
            throw new Error('Unknown thumbSize')
        }
        return this._marker(id, position, thumbUrl)
      })
  }

  _marker(id: string, position: LatLng, icon: string) {
    const { classes } = this.props
    const onMarkerClicked = () => this._handleMarkerClicked(id)
    const { lat, lng } = position
    return (
      <Marker
        key={id}
        latitude={lat}
        longitude={lng}
        captureClick>
        <img
          className={classes.markerImage}
          src={icon}
          onClick={onMarkerClicked} />
      </Marker>
    )
  }

  _handleMarkerClicked = (id: string) => {
    const { onMarkerClicked } = this.props
    onMarkerClicked(id)
  }

  _handleViewportChange = (mapboxState: ViewState) => {
    const { onMapViewportChange } = this.props
    onMapViewportChange(mapboxState)
  }
}

export default withStyles(styles)(Map)

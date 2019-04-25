import React, { Component } from 'react'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'
import withTheme from './withTheme'

import Mapbox, {
  MapMarker,
  OnMarkerClicked,
  ThumbSize
} from './components/Map'

import { ViewState } from 'react-map-gl'

import { Grid } from '@material-ui/core'

import { LatLng } from './common/image-types'
import { LoginSubmitPayload, UserProfile } from './common/payload-types'

import AppBar, { OnThumbSizeChanged } from './components/AppBar'
import ErrorDialog from './components/ErrorDialog'
import ImageGrid, { OnImageSelected } from './components/ImageGrid'
import Login from './components/Login'
import MarkerDetails, {
  OnAddedMarkerHashtags,
  OnChangeCommit,
  OnRemovedMarkerHashtag,
  OnSelectedMarkerHashtag,
  OnTextChanged
} from './components/MarkerDetails'
import Uploader, { OnCompleteUpload } from './components/Uploader'

import { OnFilterChanged } from './components/HashtagFilter'
import HashtagsUpdater from './network/hashtags-updater'
import ImageUpdater from './network/image-updater'
import LoginUpdater from './network/login-updater'
import MarkerUpdater from './network/marker-updater'
import { mergeArraysUnique, removeFirstFromArray } from './utils'

const styles: StyleRulesCallback = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit
  },
  map: {
    flex: 'column',
    marginTop: 10
  },
  details: {
    flex: 'column'
  },
  upload: {
    height: '80vh'
  },
  login: {
    height: '80vh'
  }
})

export type AppProps = {
  markerUpdater: MarkerUpdater
  imageUpdater: ImageUpdater
  loginUpdater: LoginUpdater
  hashtagsUpdater: HashtagsUpdater
  mapToken: string
  signinURL: string
  activateHashtags: boolean
} & WithStyles<typeof styles>

export type AppState = {
  thumbSize: ThumbSize
  markerMap: Map<string, MapMarker>
  selectedMarker: MapMarker | undefined
  mapCenter: LatLng
  mapZoom: number
  mapBearing?: number
  mapPitch?: number
  mapAltitude?: number
  uploading: boolean
  sendingUpload: boolean
  loggingIn: boolean
  authorized: boolean
  profile: UserProfile | null
  hasError: boolean
  errorMessage: string
  hashtags: string[]
  hashtagFilter: string | null
  showImageGrid: boolean
}

class App extends Component<AppProps, AppState> {
  private _fetchingMarkers: boolean
  private _fetchingHashtags: boolean

  constructor(props: AppProps) {
    super(props)
    this.state = {
      thumbSize: ThumbSize.Small,
      markerMap: new Map(),
      selectedMarker: undefined,
      mapCenter: new LatLng(-13.515406, -71.981180),
      mapZoom: 8,
      uploading: false,
      sendingUpload: false,
      loggingIn: false,
      authorized: false,
      profile: null,
      hasError: false,
      errorMessage: '',
      hashtags: [],
      hashtagFilter: null,
      showImageGrid: false
    }
    this._fetchingMarkers = false
    this._fetchingHashtags = false
  }

  async componentDidMount() {
    await this._authorize()
    this._updateMarkers()
    this._updateHashtags()
  }

  render() {
    const {
      classes,
      mapToken,
      signinURL,
      activateHashtags
    } = this.props
    const {
      thumbSize,
      markerMap,
      selectedMarker,
      mapCenter,
      mapZoom,
      mapBearing,
      mapPitch,
      mapAltitude,
      uploading,
      sendingUpload,
      loggingIn,
      authorized,
      profile,
      hasError,
      errorMessage,
      hashtags,
      hashtagFilter,
      showImageGrid
    } = this.state
    const markers = Array.from(markerMap.values())
    const showMain = !uploading && !loggingIn && !showImageGrid
    return (
      <div>
        <Grid
          className={classes.root}
          container
          direction="row"
          justify="center"
        >
          <Grid item xs={12}>
            <AppBar
              thumbSize={thumbSize}
              hashtags={hashtags}
              hashtagFilter={hashtagFilter}
              activateHashtags={activateHashtags}
              authorized={authorized}
              onThumbSizeChanged={this._onThumbSizeChanged}
              onFilterChanged={this._onFilterChanged}
              onGridOpened={this._onGridOpened}
              onUploaderOpened={this._onUploading}
              onLoginOpened={this._onLoggingIn}
            />
          </Grid>
          {showMain &&
            <Grid item xs={8} className={classes.map}>
              <Mapbox
                mapboxAccessToken={mapToken}
                markers={markers}
                mapCenter={mapCenter}
                mapZoom={mapZoom}
                mapBearing={mapBearing}
                mapPitch={mapPitch}
                mapAltitude={mapAltitude}
                thumbSize={thumbSize}
                onMapViewportChange={this._onMapViewportChange}
                onMarkerClicked={this._onMarkerClicked}
              />
            </Grid>
          }
          {showMain &&
            <Grid item xs={4}>
              <MarkerDetails
                marker={selectedMarker}
                activateHashtags={activateHashtags}
                onTitleChanged={this._onMarkerTitleChanged}
                onTitleChangeCommit={this._onMarkerTitleChangeCommit}
                onDescriptionChanged={this._onMarkerDescriptionChanged}
                onDescriptionChangeCommit=
                {this._onMarkerDescriptionChangeCommit}
                onSelectedHashtag={this._onMarkerSelectedHashtag}
                onAddedHashtags={this._onMarkerAddedHashtags}
                onRemovedHashtag={this._onMarkerRemovedHashtag}
              />
            </Grid>
          }
          {uploading &&
            <Grid item xs={12} className={classes.upload}>
              <Uploader
                sendingUpload={sendingUpload}
                onCompleteUpload={this._onCompleteUpload}
              />
            </Grid>
          }
          {loggingIn &&
            <Grid item xs={12} className={classes.login}>
              <Login
                signinURL={signinURL}
                authorized={authorized}
                profile={profile}
                onLoginSubmit={this._onLoginSubmit}
                onLoginLogout={this._onLoginLogout}
                onLoginClose={this._onLoginClose} />
            </Grid>
          }
          {showImageGrid &&
            <Grid item xs="auto">
              <ImageGrid
                images={markers}
                onImageSelected={this._onImageSelected} />
            </Grid>
          }
        </Grid >
        <ErrorDialog
          open={hasError}
          errorMessage={errorMessage}
          onErrorDialogClose={this._onErrorDialogClose} />
      </div>
    )
  }

  //
  // Map
  //
  _onMapViewportChange = (mapboxState: ViewState) => {
    const {
      latitude,
      longitude,
      zoom,
      bearing,
      pitch,
      altitude
    } = mapboxState
    const mapCenter = new LatLng(latitude, longitude)
    this.setState({
      ...this.state,
      mapCenter,
      mapZoom: zoom,
      mapBearing: bearing,
      mapPitch: pitch,
      mapAltitude: altitude
    })
  }
  //
  // Markers
  //
  _updateMarkers = async () => {
    const { authorized, hashtagFilter } = this.state
    if (!authorized) {
      this._clearMarkers()
      return
    }

    if (this._fetchingMarkers) return
    this._fetchingMarkers = true

    const { markerUpdater } = this.props
    const markerResult = await markerUpdater.fetchMarkers(hashtagFilter)
    this._fetchingMarkers = false

    if (!markerResult.success) {
      this._clearMarkers()
      return this._reportError(markerResult.errorMessage!)
    }

    const markers = Array.from(markerResult.markerMap!.values())
    const markerMap = markerResult.markerMap!
    if (markers.length > 0) {
      const selectedMarker = markers[0]
      this.setState({
        ...this.state,
        markerMap,
        selectedMarker,
        mapCenter: selectedMarker.position
      })
    } else {
      this._clearMarkers()
    }
  }

  _clearMarkers() {
    this.setState({
      ...this.state,
      markerMap: new Map(),
      selectedMarker: undefined
    })
  }

  _onThumbSizeChanged: OnThumbSizeChanged = thumbSize => {
    this.setState({ ...this.state, thumbSize })
  }

  _onFilterChanged: OnFilterChanged = hashtagFilter => {
    this.setState({ ...this.state, hashtagFilter }, this._updateMarkers)
  }

  _onImageSelected: OnImageSelected = id => {
    const { markerMap } = this.state
    const selectedMarker = markerMap.get(id)!
    this.setState({
      ...this.state,
      selectedMarker,
      mapCenter: selectedMarker.position,
      showImageGrid: false
    })
  }

  //
  // Login/Profile
  //
  async _authorize() {
    const { loginUpdater } = this.props
    const authResult = await loginUpdater.checkAuth()
    if (!authResult.success) {
      return this._reportError(authResult.errorMessage!)
    }
    const { authorized } = authResult
    if (!authorized) return

    const profileResult = await loginUpdater.fetchProfile()
    if (!profileResult.success) {
      return this._reportError(profileResult.errorMessage!)
    }
    const profile = profileResult.profile!
    this.setState({ ...this.state, authorized, profile })
  }

  _onLoggingIn = () => {
    this.setState({ ...this.state, loggingIn: true, showImageGrid: false })
  }

  _onLoginSubmit = async (payload: LoginSubmitPayload) => {
    const { loginUpdater } = this.props
    const loginResult = await loginUpdater.submitSignin(payload)
    this.setState({ ...this.state, loggingIn: false })
    if (loginResult.success) {
      await this._authorize()
    } else {
      this._reportError(loginResult.errorMessage!)
    }
    this._updateMarkers()
  }

  _onLoginClose = () => {
    this.setState({ ...this.state, loggingIn: false })
  }

  _onLoginLogout = async () => {
    const { loginUpdater } = this.props
    await loginUpdater.logout()
    this.setState({
      ...this.state,
      authorized: false,
      profile: null,
      loggingIn: false
    })
    this._updateMarkers()
  }

  //
  // Image Upload
  //
  _onUploading = () => {
    this.setState({ ...this.state, uploading: true, showImageGrid: false })
  }

  _onCompleteUpload: OnCompleteUpload = async images => {
    const { imageUpdater } = this.props
    this.setState({ ...this.state, sendingUpload: true })

    const uploadResponse = await imageUpdater.uploadFiles(images)
    this.setState({ ...this.state, uploading: false, sendingUpload: false })
    this._updateMarkers()

    if (!uploadResponse.success) {
      this._reportError(uploadResponse.errorMessage!)
    }
  }

  //
  // Markers
  //
  _onMarkerClicked: OnMarkerClicked = id => {
    const { markerMap } = this.state
    const selectedMarker = markerMap.get(id)
    this.setState({ ...this.state, selectedMarker })
  }

  _onMarkerTitleChanged: OnTextChanged = (id, text) => {
    const { markerMap, selectedMarker } = this.state
    const marker = { ...selectedMarker, title: text } as MapMarker
    markerMap.set(id, marker)
    this.setState({ ...this.state, markerMap, selectedMarker: marker })
  }

  _onMarkerTitleChangeCommit: OnChangeCommit = async id => {
    const { imageUpdater } = this.props
    const { markerMap } = this.state
    const marker = markerMap.get(id)
    if (marker == null) return
    const updateResult =
      await imageUpdater.updateMetadata({ id, title: marker.title })
    if (!updateResult.success) this._reportError(updateResult.errorMessage!)
  }

  _onMarkerDescriptionChanged: OnTextChanged = (id, text) => {
    const { markerMap, selectedMarker } = this.state
    const marker = { ...selectedMarker, description: text } as MapMarker
    markerMap.set(id, marker)
    this.setState({ ...this.state, markerMap, selectedMarker: marker })
  }

  _onMarkerDescriptionChangeCommit: OnChangeCommit = async id => {
    const { imageUpdater } = this.props
    const { markerMap } = this.state
    const marker = markerMap.get(id)
    if (marker == null) return

    const updateResult =
      await imageUpdater.updateMetadata({ id, description: marker.description })
    if (!updateResult.success) this._reportError(updateResult.errorMessage!)
  }

  //
  // Hashtags
  //
  async _updateHashtags() {
    const { activateHashtags } = this.props
    if (!activateHashtags) return
    const { authorized } = this.state
    if (!authorized) {
      this._clearHashtags()
      return
    }

    if (this._fetchingHashtags) return
    this._fetchingHashtags = true

    const { hashtagsUpdater } = this.props
    const hashtagsResult = await hashtagsUpdater.fetchHashtags()
    this._fetchingHashtags = false

    if (!hashtagsResult.success) {
      this._clearHashtags()
      return this._reportError(hashtagsResult.errorMessage!)
    }

    const hashtags = hashtagsResult.hashtags!
    if (hashtags.length > 0) {
      const currentFilter = this.state.hashtagFilter
      const hashtagFilter = (
        currentFilter != null && hashtags.includes(currentFilter)
      ) ? currentFilter : null

      this.setState({ ...this.state, hashtags, hashtagFilter })
    } else {
      this._clearHashtags()
    }
  }

  _clearHashtags() {
    this.setState({ ...this.state, hashtags: [], hashtagFilter: null })
  }

  _onMarkerSelectedHashtag: OnSelectedMarkerHashtag = (_id, tag) => {
    this._onFilterChanged(tag)
  }

  _onMarkerAddedHashtags: OnAddedMarkerHashtags = async (id, tags) => {
    const { imageUpdater } = this.props
    const { markerMap, selectedMarker } = this.state
    if (selectedMarker == null) return

    const hashtags = mergeArraysUnique(selectedMarker.hashtags, tags)
    const marker = { ...selectedMarker, hashtags } as MapMarker
    markerMap.set(id, marker)
    this.setState({ ...this.state, markerMap, selectedMarker: marker })

    const updateResult =
      await imageUpdater.updateMetadata({ id, hashtags: marker.hashtags })
    if (!updateResult.success) this._reportError(updateResult.errorMessage!)
    this._updateHashtags()
  }

  _onMarkerRemovedHashtag: OnRemovedMarkerHashtag = async (id, tag) => {
    const { imageUpdater } = this.props
    const { markerMap, selectedMarker } = this.state
    if (selectedMarker == null) return

    const hashtags = removeFirstFromArray(selectedMarker.hashtags, tag)
    const marker = { ...selectedMarker, hashtags } as MapMarker
    markerMap.set(id, marker)
    this.setState({ ...this.state, markerMap, selectedMarker: marker })

    const updateResult =
      await imageUpdater.updateMetadata({ id, hashtags: marker.hashtags })
    if (!updateResult.success) this._reportError(updateResult.errorMessage!)
    this._updateHashtags()
  }

  //
  // Errors
  //
  _reportError(errorMessage: string) {
    this.setState({ ...this.state, hasError: true, errorMessage })
  }

  _onErrorDialogClose = () => {
    this.setState({ ...this.state, hasError: false })
  }

  //
  // Grid
  //
  _onGridOpened = () => {
    this.setState({ ...this.state, showImageGrid: true })
  }
}

// @ts-ignore
export default withTheme(withStyles(styles)(App))

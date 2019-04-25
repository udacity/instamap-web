import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

import HashtagsUpdater from './network/hashtags-updater'
import ImageUpdater from './network/image-updater'
import LoginUpdater from './network/login-updater'
import MarkerUpdater from './network/marker-updater'

// Set to TRUE for Capstone project
const ACTIVATE_HASHTAGS = false

const mapToken = process.env.REACT_APP_MAP_TOKEN
const serverURL = process.env.REACT_APP_SERVER_URL!
const uploadURL = `${serverURL}/image-upload`
const updateURL = `${serverURL}/update-meta`
const imagesMetaURL = `${serverURL}/images-meta`
const signinURL = `${serverURL}/signin`
const authURL = `${serverURL}/auth`
const profileURL = `${serverURL}/profile`
const logoutURL = `${serverURL}/logout`
const hashtagsURL = `${serverURL}/hashtags`

const markerUpdater = new MarkerUpdater(serverURL, imagesMetaURL)
const imageUpdater = new ImageUpdater(uploadURL, updateURL)
const loginUpdater = new LoginUpdater(signinURL, authURL, profileURL, logoutURL)
const hashtagsUpdater = new HashtagsUpdater(hashtagsURL)

ReactDOM
  .render(
    <App
      markerUpdater={markerUpdater}
      imageUpdater={imageUpdater}
      loginUpdater={loginUpdater}
      hashtagsUpdater={hashtagsUpdater}
      mapToken={mapToken}
      signinURL={signinURL}
      activateHashtags={ACTIVATE_HASHTAGS}
    />,
    document.getElementById('root')
  )

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

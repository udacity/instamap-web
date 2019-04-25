import React, { Component } from 'react'

import Dropzone, {
  DropFilesEventHandler,
  DropzoneRenderFunction
} from 'react-dropzone'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import { Button } from '@material-ui/core'

import { css } from '@emotion/core'
import Typography from '@material-ui/core/Typography'
import { RingLoader } from 'react-spinners'

const styles: StyleRulesCallback = theme => ({
  dropArea: {
    width: '100%',
    height: '40vh',
    background: theme.palette.background.paper,
    cursor: 'pointer'
  },
  uploadArea: {
    width: '100%',
    height: '40vh'
  },
  uploadImages: {
    width: '100%',
    height: '35vh',
    overflowY: 'scroll'
  },
  uploadingImages: {
    height: '80vh'
  }
})

const spinnerCss = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`.styles

export type OnCompleteUpload = (images: File[]) => void
export type UploaderProps = {
  onCompleteUpload: OnCompleteUpload
  sendingUpload: boolean
} & WithStyles<typeof styles>

export type UploaderState = {
  images: File[]
}

class Uploader extends Component<UploaderProps, UploaderState> {
  constructor(props: UploaderProps) {
    super(props)
    this.state = { images: [] }
  }

  render() {
    const { sendingUpload } = this.props
    if (sendingUpload) return this._showUploading()

    const onDrop: DropFilesEventHandler = files => {
      const { images } = this.state
      const unique = this._uniqueImages(images.concat(files))
      this.setState({ ...this.state, images: unique })
    }
    return (
      <div>
        <Dropzone onDrop={onDrop}>
          {this._dropArea}
        </Dropzone>
        {this._uploadArea()}
      </div>
    )
  }

  onComponentDidMount() {
    this.setState({ images: [] })
  }

  _showUploading() {
    return (
      <div>
        <RingLoader
          css={spinnerCss}
          sizeUnit={'px'}
          size={250}
          color={'blue'}
          loading
        />
        <Typography variant="h6" color="inherit">
          Uploading Image(s) ...
        </Typography>
      </div>
    )
  }

  _uniqueImages(images: File[]): File[] {
    const byName = new Map()
    for (const img of images) {
      byName.set(img.name, img)
    }
    return Array.from(byName.values())
  }

  _dropArea: DropzoneRenderFunction = ({ getRootProps, getInputProps }) => {
    const { classes } = this.props
    return (
      <div {...getRootProps()} className={classes.dropArea}>
        <input {...getInputProps()} />
        <p>Drop your image(s) here, or click to select image(s)</p>
      </div>
    )
  }

  _uploadArea() {
    const { classes } = this.props
    const { images } = this.state
    const imageComponents = images.map(img => <p key={img.name}>{img.name}</p>)
    return (
      <div className={classes.uploadArea}>
        <div className={classes.uploadImages}>
          {imageComponents}
        </div>
        <Button onClick={this._onCancel}>Cancel</Button>
        <Button onClick={this._onUpload}>Upload</Button>
      </div>
    )
  }

  _onUpload = () => {
    const { onCompleteUpload } = this.props
    const { images } = this.state
    onCompleteUpload(images)
  }

  _onCancel = () => {
    const { onCompleteUpload } = this.props
    onCompleteUpload([])
  }
}

export default withStyles(styles)(Uploader)

import React, { Component } from 'react'

import { Grid } from '@material-ui/core'
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'
import { MapMarker } from './Map'

const styles: StyleRulesCallback = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit
  },
  imageContainer: {
    width: 165,
    height: 165
  },
  image: {
    width: 160,
    height: 160,
    cursor: 'pointer'
  }
})

export type OnImageSelected = (id: string) => void
export type ImageGridProps = {
  images: MapMarker[]
  onImageSelected: OnImageSelected
} & WithStyles<typeof styles>

class ImageGrid extends Component<ImageGridProps> {

  render() {
    const { classes } = this.props
    return (
      <Grid
        className={classes.root}
        direction="row"
        wrap="wrap"
        spacing={0}
        justify="center"
        container>
        {this._renderImages()}
      </Grid>
    )
  }

  _renderImages() {
    const { classes, images, onImageSelected } = this.props
    return images.map(img => (
      <Grid
        key={img.imageUrl}
        item
        xs="auto"
        className={classes.imageContainer}>
        <img
          className={classes.image}
          src={img.imageUrl}
          onClick={() => onImageSelected(img.id)}
        />
      </Grid>
    ))
  }
}

export default withStyles(styles)(ImageGrid)

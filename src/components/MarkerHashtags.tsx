import React, { Component } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Link,
  TextField
} from '@material-ui/core'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

const styles: StyleRulesCallback = theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing.unit
  },
  removeButton: {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 5,
    display: 'inline-block',
    transition: 'all .2s ease-in-out',
    '&:hover': { transform: 'scale(1.6)' }
  },
  addButton: {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 5,
    display: 'inline-block',
    transition: 'all .2s ease-in-out',
    '&:hover': { transform: 'scale(1.6)' }
  },
  hashtagsTextfield: {
    fontWeight: 'lighter'
  }
})

export type OnAddedHashtags = (tag: string[]) => void
export type OnRemovedHashtag = (tag: string) => void
export type OnSelectedHashtag = (tag: string) => void
export type MarkerHashtagsProps = {
  hashtags: string[]
  onAddedHashtags: OnAddedHashtags
  onRemovedHashtag: OnRemovedHashtag
  onSelectedHashtag: OnSelectedHashtag
} & WithStyles<typeof styles>

export type MarkerHashtagsState = {
  addingHashtags: boolean
  hashtagsAdded: string[]
}

class MarkerHashtags extends
  Component<MarkerHashtagsProps, MarkerHashtagsState> {

  constructor(props: MarkerHashtagsProps) {
    super(props)
    this.state = { addingHashtags: false, hashtagsAdded: [] }
  }

  render() {
    const { classes, hashtags } = this.props
    return (
      <div>
        <Grid
          className={classes.root}
          container
          direction="row"
          justify="center"
        >
          <Grid item xs={11}>
            {hashtags.map(this._renderHashtag)}
          </Grid>
          <Grid item xs={1}>
            <Link
              underline="none"
              className={classes.removeButton}
              onClick={this._handleAddHashtags}>
              +
          </Link>
          </Grid>
        </Grid>
        {this._renderAddDialog()}
      </div>
    )
  }

  _renderHashtag = (tag: string) => {
    const { classes, onSelectedHashtag, onRemovedHashtag } = this.props
    return (
      <span key={tag}>
        <Link
          onClick={() => onSelectedHashtag(tag)}>
          #{tag + ' '}
        </Link>
        <Link
          underline="none"
          className={classes.removeButton}
          onClick={() => onRemovedHashtag(tag)}>
          -
          </Link>
      </span>
    )
  }

  _renderAddDialog() {
    const { classes } = this.props
    const { addingHashtags, hashtagsAdded } = this.state
    return (
      <Dialog
        open={addingHashtags}
        onClose={this._handleDialogClose}>
        <DialogTitle>Hashtags</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter one ore more hashtags (without the #), separated by a comma
          </DialogContentText>
          <DialogActions>
            <TextField
              autoFocus
              className={classes.hashtagsTextfield}
              fullWidth
              onChange={this._handleHashtagsAddedChanged}
              value={hashtagsAdded.join(', ')} />
          </DialogActions>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this._handleDialogClose}>
              OK
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog >
    )
  }

  _handleAddHashtags = () => {
    this.setState({ ...this.state, addingHashtags: true })
  }

  _handleHashtagsAddedChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hashtagsAdded = e.target.value
      .split(',')
      .map(x => x.trim())

    this.setState({ ...this.state, hashtagsAdded })
  }

  _handleDialogClose = () => {
    const { onAddedHashtags } = this.props
    const { hashtagsAdded } = this.state
    const validHashtags = hashtagsAdded.filter(x => x.length > 0)
    if (validHashtags.length > 0) onAddedHashtags(validHashtags)

    this.setState({ ...this.state, addingHashtags: false, hashtagsAdded: [] })
  }
}

export default withStyles(styles)(MarkerHashtags)

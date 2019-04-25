import React, { ChangeEvent, Component } from 'react'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import HashtagFilter, { OnFilterChanged } from './HashtagFilter'
import { ThumbSize } from './Map'

const styles: StyleRulesCallback = theme => ({
  grow: { flexGrow: 1 },
  appBar: { height: '8vh' },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  select: {
    color: theme.palette.common.white
  }
})

export type OnThumbSizeChanged = (thumbSize: ThumbSize) => void
export type AppBarProps = {
  thumbSize: ThumbSize,
  authorized: boolean,
  hashtags: string[]
  hashtagFilter: string | null
  activateHashtags: boolean
  onThumbSizeChanged: OnThumbSizeChanged,
  onFilterChanged: OnFilterChanged
  onUploaderOpened: () => void
  onGridOpened: () => void
  onLoginOpened: () => void
} & WithStyles<typeof styles>

class ButtonAppBar extends Component<AppBarProps> {
  render() {
    const {
      classes,
      thumbSize,
      authorized,
      hashtags,
      hashtagFilter,
      activateHashtags,
      onFilterChanged
    } = this.props
    return (
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Button color="inherit" onClick={this._handleUploaderOpened}>
            Image
          </Button>
          <FormControl className={classes.formControl}>
            <InputLabel
              htmlFor="thumbnail"
              style={{ color: 'white' }}>
              Thumbnail
            </InputLabel>
            <Select
              value={thumbSize}
              onChange={this._handleThumbSizeChanged}
              inputProps={{
                name: 'thumbnail',
                id: 'thumbnail'
              }}
              className={classes.select}>
              <MenuItem
                value={ThumbSize.Small}>{ThumbSize[ThumbSize.Small]}
              </MenuItem>
              <MenuItem
                value={ThumbSize.Medium}>{ThumbSize[ThumbSize.Medium]}
              </MenuItem>
              <MenuItem
                value={ThumbSize.Large}>{ThumbSize[ThumbSize.Large]}
              </MenuItem>
            </Select>
          </FormControl>
          {activateHashtags &&
            <HashtagFilter
              hashtags={hashtags}
              hashtagFilter={hashtagFilter}
              onFilterChanged={onFilterChanged}
            />
          }
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Instamap
          </Typography>
          <Button color="inherit" onClick={this._handleGridOpened}>
            Grid
          </Button>
          <Button color="inherit" onClick={this._handleLoginOpened}>
            {authorized ? 'Profile' : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    )
  }

  _handleThumbSizeChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onThumbSizeChanged } = this.props
    const size: ThumbSize = parseInt(event.target.value)
    onThumbSizeChanged(size)
  }

  _handleUploaderOpened = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { onUploaderOpened } = this.props
    onUploaderOpened()
  }

  _handleGridOpened = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { onGridOpened } = this.props
    onGridOpened()
  }

  _handleLoginOpened = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const { onLoginOpened } = this.props
    onLoginOpened()
  }
}

export default withStyles(styles)(ButtonAppBar)

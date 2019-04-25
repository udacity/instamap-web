import React, { ChangeEvent, Component } from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

const styles: StyleRulesCallback = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  select: {
    color: theme.palette.common.white
  }
})

export const NO_FILTER = '>>> nofilter <<<'
export type OnFilterChanged = (filter: string | null) => void
export type HashtagFilterProps = {
  hashtags: string[]
  hashtagFilter: string | null
  onFilterChanged: OnFilterChanged
} & WithStyles<typeof styles>
export type HashtagFilterState = {}

class HashtagFilter extends Component<HashtagFilterProps, HashtagFilterState> {
  constructor(props: HashtagFilterProps) {
    super(props)
    this.state = {}
  }

  render() {
    const { classes, hashtagFilter } = this.props
    return (
      <FormControl className={classes.formControl}>
        <InputLabel
          htmlFor="filter"
          style={{ color: 'white' }}>
          Filter
        </InputLabel>
        <Select
          value={hashtagFilter || NO_FILTER}
          onChange={this._handleFilterChanged}
          inputProps={{
            name: 'hashtag',
            id: 'hashtag'
          }}
          className={classes.select}>
          {this._renderMenuItems()}
        </Select>
      </FormControl>
    )
  }

  _renderMenuItems() {
    const { hashtags } = this.props
    return (
      [<MenuItem key={NO_FILTER} value={NO_FILTER}>{'None'}</MenuItem>]
        .concat(
          hashtags.sort().map(tag =>
            <MenuItem
              key={tag}
              value={tag}>{'#' + tag}
            </MenuItem>
          )
        )
    )
  }

  _handleFilterChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onFilterChanged } = this.props
    const filter: string = event.target.value
    return filter === NO_FILTER
      ? onFilterChanged(null)
      : onFilterChanged(filter)
  }
}

export default withStyles(styles)(HashtagFilter)

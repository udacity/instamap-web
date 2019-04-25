import React, { Component } from 'react'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import {
  Card,
  CardActionArea,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from '@material-ui/core'
import { MapMarker } from '../components/Map'
import MarkerHashtags, {
  OnAddedHashtags,
  OnRemovedHashtag,
  OnSelectedHashtag
} from './MarkerHashtags'

const styles: StyleRulesCallback = _ => ({
  image: {
    width: '100%'
  },
  card: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5
  },
  cardTitle: {
    fontWeight: 'bold',
    padding: 5
  },
  cardDescription: {
    fontWeight: 'lighter'
  }
})

export type OnTextChanged = (id: string, text: string) => void
export type OnChangeCommit = (id: string) => void
export type OnSelectedMarkerHashtag = (id: string, tag: string) => void
export type OnAddedMarkerHashtags = (id: string, tags: string[]) => void
export type OnRemovedMarkerHashtag = (id: string, tag: string) => void
export type MarkerDetailsProps = {
  marker: MapMarker | undefined
  activateHashtags: boolean
  onTitleChanged: OnTextChanged
  onDescriptionChanged: OnTextChanged
  onTitleChangeCommit: OnChangeCommit
  onDescriptionChangeCommit: OnChangeCommit
  onAddedHashtags: OnAddedMarkerHashtags
  onRemovedHashtag: OnRemovedMarkerHashtag
  onSelectedHashtag: OnSelectedMarkerHashtag
} & WithStyles<typeof styles>

function extractDate(date: string, time: string): Date {
  const dt = new Date(`${date.replace(/\:/g, '-')}`)
  const [h, m, s] = time.split(':').map(Number)
  dt.setHours(h)
  dt.setMinutes(m)
  dt.setSeconds(s)
  return dt
}

class MarkerDetails extends Component<MarkerDetailsProps> {
  private _descriptionDirty: boolean = false
  private _titleDirty: boolean = false

  render() {
    const { marker } = this.props
    return marker == null ? this._empty() : this._marker(marker)
  }

  _marker(marker: MapMarker) {
    const { classes, activateHashtags } = this.props
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardContent>
            <TextField
              className={classes.cardTitle}
              fullWidth
              onChange={this._handleTitleChanged}
              onBlur={this._handleTitleBlured}
              value={marker.title} />
            <img className={classes.image} src={marker.imageUrl} />
            {activateHashtags &&
              <MarkerHashtags
                hashtags={marker.hashtags}
                onSelectedHashtag={this._handleSelectedHashtag}
                onAddedHashtags={this._handleAddedHashtags}
                onRemovedHashtag={this._handleRemovedHashtag}
              />
            }
            <TextField
              className={classes.cardDescription}
              fullWidth
              multiline
              onChange={this._handleDescriptionChanged}
              onBlur={this._handleDescriptionBlured}
              value={marker.description} />
            <Table>
              <TableBody>
                {this._propertiesRows(marker)}
              </TableBody>
            </Table>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  _propertiesRows(marker: MapMarker) {
    const coordinates =
      `${marker.position.lat.toFixed(4)}, ${marker.position.lng.toFixed(4)}`
    const date = extractDate(marker.date, marker.time)
    const rows = [
      { label: 'Coordinates', value: coordinates },
      { label: 'Altitude', value: marker.altitude },
      { label: 'Taken', value: date.toLocaleString() },
      { label: 'Camera', value: marker.camera },
      { label: 'Scene', value: marker.scene }
    ]

    return rows.map(row => (
      <TableRow key={row.label}>
        <TableCell>{row.label}</TableCell>
        <TableCell>{row.value}</TableCell>
      </TableRow>
    ))
  }

  _empty() {
    return <div>Please upload an image</div>
  }

  _handleTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this._titleDirty = true
    const { marker, onTitleChanged } = this.props
    if (marker == null) return
    onTitleChanged(marker.id, e.target.value)
  }

  _handleTitleBlured: React.EventHandler<any> = _ => {
    if (!this._titleDirty) return
    const { marker, onTitleChangeCommit } = this.props
    if (marker == null) return
    onTitleChangeCommit(marker.id)
    this._titleDirty = false
  }

  _handleDescriptionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this._descriptionDirty = true
    const { marker, onDescriptionChanged } = this.props
    if (marker == null) return
    onDescriptionChanged(marker.id, e.target.value)
  }

  _handleDescriptionBlured: React.EventHandler<any> = _ => {
    if (!this._descriptionDirty) return
    const { marker, onDescriptionChangeCommit } = this.props
    if (marker == null) return
    onDescriptionChangeCommit(marker.id)
    this._descriptionDirty = false
  }

  _handleSelectedHashtag: OnSelectedHashtag = tag => {
    const { marker, onSelectedHashtag } = this.props
    if (marker == null) return
    onSelectedHashtag(marker.id, tag)
  }

  _handleAddedHashtags: OnAddedHashtags = tags => {
    const { marker, onAddedHashtags } = this.props
    if (marker == null) return
    onAddedHashtags(marker.id, tags)
  }

  _handleRemovedHashtag: OnRemovedHashtag = tag => {
    const { marker, onRemovedHashtag } = this.props
    if (marker == null) return
    onRemovedHashtag(marker.id, tag)
  }
}

export default withStyles(styles)(MarkerDetails)

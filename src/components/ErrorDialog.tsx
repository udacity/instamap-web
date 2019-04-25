import React, { Component } from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

const styles: StyleRulesCallback = _theme => ({
})

export type ErrorDialogProps = {
  open: boolean
  errorMessage: string
  onErrorDialogClose: () => void
} & WithStyles<typeof styles>
export type ErrorDialogState = {}

class ErrorDialog extends Component<ErrorDialogProps, ErrorDialogState> {
  render() {
    const { open, errorMessage } = this.props
    return (
      <Dialog
        open={open}
        onClose={this._handleDialogClose}>
        <DialogTitle>{'⚡An Error Occurred 💥'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {errorMessage}
          </DialogContentText>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={this._handleDialogClose}>
              OK 😢
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog >
    )
  }

  _handleDialogClose = () => {
    const { onErrorDialogClose } = this.props
    onErrorDialogClose()
  }
}

export default withStyles(styles)(ErrorDialog)

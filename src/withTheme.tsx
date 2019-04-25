import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import React from 'react'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  }
})

/* tslint:disable variable-name */
function withTheme(Component: React.ComponentClass) {
  function WithTheme(props: any) {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    )
  }

  return WithTheme
}

export default withTheme

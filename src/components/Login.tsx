import React, { ChangeEvent, Component, FormEvent } from 'react'

import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Link,
  Paper,
  Typography
} from '@material-ui/core'

import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import {
  LoginSubmitPayload,
  LoginType,
  UserProfile
} from '../common/payload-types'

const styles: StyleRulesCallback = theme => ({
  wrapper: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 2
  },
  form: {
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  done: {
    marginTop: theme.spacing.unit * 3
  },
  link: {
    marginTop: 20,
    fontStyle: 'italic',
    cursor: 'pointer'
  }
})

export type OnLoginSubmit = (payload: LoginSubmitPayload) => void
export type LoginProps = {
  signinURL: string
  onLoginSubmit: OnLoginSubmit
  onLoginClose: () => void
  onLoginLogout: () => void
  authorized: boolean
  profile: UserProfile | null
} & WithStyles<typeof styles>
export type LoginState = {
  signup: boolean
}

class Login extends Component<LoginProps, LoginState> {
  // The form itself takes care of input validation so it is fine
  // to default to empty strings here
  private _password: string = ''
  private _email: string = ''

  constructor(props: LoginProps) {
    super(props)
    this.state = { signup: false }
  }

  render() {
    const { classes, authorized } = this.props
    const { signup } = this.state
    const screen = authorized
      ? this._profile()
      : signup ? this._signup() : this._signin()
    return (
      <div className={classes.wrapper}>
        {screen}
      </div>
    )
  }

  _profile() {
    const { classes, profile, onLoginLogout, onLoginClose } = this.props
    const { email } = profile!
    return (
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        {this._emailInput(true, email)}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.done}
          onClick={onLoginClose}>
          Done
          </Button>
        <Link
          component="button"
          variant="body2"
          className={classes.link}
          onClick={onLoginLogout}>
          Logout
        </Link>
      </Paper>
    )
  }

  _signin() {
    const { classes, onLoginClose } = this.props
    return (
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign in
          </Typography>
        <form
          onSubmit={this._handleLoginSubmit}
          className={classes.form}>
          {this._emailInput()}
          {this._passwordInput()}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign in
            </Button>
        </form>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.done}
          onClick={onLoginClose}>
          Cancel
          </Button>
        <Link
          component="button"
          variant="body2"
          className={classes.link}
          onClick={() => this.setState({ ...this.state, signup: true })}>
          Sign up
        </Link>
      </Paper>
    )
  }

  _signup() {
    const { classes, onLoginClose } = this.props
    return (
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          method="post"
          action=""
          onSubmit={this._handleSignupSubmit}
          className={classes.form}>
          {this._emailInput()}
          {this._passwordInput()}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}>
            Sign up
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.done}
            onClick={onLoginClose}>
            Cancel
            </Button>
        </form>
        <Link
          component="button"
          variant="body2"
          className={classes.link}
          onClick={() => this.setState({ ...this.state, signup: false })}>
          Sign in
        </Link>
      </Paper>
    )
  }

  _emailInput(readOnly = false, email?: string) {
    return (
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="email">Email Address</InputLabel>
        <Input
          id="email"
          name="email"
          autoComplete="email"
          autoFocus={!readOnly}
          readOnly={readOnly}
          value={email}
          onChange={this._onEmailChanged} />
      </FormControl>
    )
  }

  _passwordInput() {
    return (
      <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          name="password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={this._onPasswordChanged} />
      </FormControl>
    )
  }

  _onPasswordChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    this._password = e.target.value
  }

  _onEmailChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    this._email = e.target.value
  }

  _handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { onLoginSubmit } = this.props
    const payload = {
      type: LoginType.Signin,
      email: this._email,
      password: this._password
    }
    onLoginSubmit(payload)
    return false
  }

  _handleSignupSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { onLoginSubmit } = this.props
    const payload = {
      type: LoginType.Signup,
      email: this._email,
      password: this._password
    }
    onLoginSubmit(payload)
    return false
  }
}

export default withStyles(styles)(Login)

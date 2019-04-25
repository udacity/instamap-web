## Instamap Web Frontend

## Preparation

### Installing Dependencies

Run `npm install` in order to obtain all dependencies of this frontend application.

### Obtaining a Mapbox Token

We will be using mapbox to show the map in our application.

Obtain a mapbox access token [here](https://account.mapbox.com/access-tokens/).

## Starting

In the project directory, you can run: `npm start` which runs the app in the development mode.

Make sure you have the needed env vars set **first**:

```sh
export REACT_APP_MAP_TOKEN=<your mapbox token>
export REACT_APP_SERVER_URL=http://localhost:3333
```

#### Setting Env Vars on Windows

```sh
set REACT_APP_MAP_TOKEN=<your mapbox token>
set REACT_APP_SERVER_URL=http://localhost:3333
```

### Connecting to the Server

Run the server in a separate terminal.

### Opening the Web App

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

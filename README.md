# Spotify widget for OBS

Whether you stream on Twitch or Youtube, using OBS or Streamlabs OBS, this widget can be used for your stream!

It is completely open source and customisable! It checks for updates every 5 seconds (customisable).

This widget uses Express on Node.js, HTML, CSS and ES6 Javascript.

## How to setup?

-    [Spotify API](#spotify-api)
-    [Node.js](#nodejs)
-    [OBS setup](#obs-setup)

### Spotify API

1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard/applications) and create a new application
2. In the application, fill in the name and description.
3. Afterwards, put [http://localhost:8888/callback](https://youtu.be/dQw4w9WgXcQ) as a Redirect URI
4. Note down the Client ID, Client Secret and Redirect URI for the [environment variables](#environment-variables)

### Environment variables

1. Open your preferred IDE (Visual Studio Code recommended)
2. In the .env file, put in your Client ID, Client Secret and Redirect URI

### Node.js

(You will have to do this before every stream, excluding no. 1)

1. If you don't have node JS installed, install the latest version of node from [here](https://nodejs.org)
2. To run the script, run `node server.js` in the command prompt
3. Open the URL http://localhost:8888/login
4. If it's successful, you can close the window

### OBS setup

1. Open your OBS and add a new **Browser Source**
2. Browser Source settings

-    `URL: http://localhost:8888/twitch-overlay`
-    `Width: 365`
-    `Height: 115`

# Credits

-    [RyanPython on Twitch](https://twitch.tv/RyanPython)

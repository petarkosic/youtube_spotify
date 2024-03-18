![Home Page](./client/src/assets/home-page.png 'Home Page')

## YouTube to Spotify Converter

Convert your favorite YouTube playlists into Spotify playlists effortlessly with this YouTube to Spotify Converter.

## Features

**Seamless Conversion** : Quickly convert YouTube playlists into Spotify playlists.
**Easy to Use**: Simple user interface for hassle-free conversion.

## Contents

1. [Requirements](#requirements)
2. [Installation](#installation)

## Requirements

- Node js 16.+ (https://nodejs.org)
- Google Cloud Account
- Spotify Account

## Installation

Clone the project and navigate to it:

```
git clone https://github.com/petarkosic/youtube_spotify.git
cd /youtube_spotify
```

<br />
Get the Google client id and client secret.

[Enable Apis For Your Project](https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps#enable-apis)

**IMPORTANT**
While creating the client id and client secret for Google, make sure to add the redirect URI as `http://localhost:5000/google/callback`

<br />
Get the spotify client id and client secret.

[Create Spotify App](https://developer.spotify.com/documentation/web-api/concepts/apps)

**IMPORTANT**
While creating the client id and client secret for Spotify, make sure to add the redirect URI as `http://localhost:5000/spotify/callback`

<br />

Inside `/server` folder, create `.env` file:

```
FRONTEND_URI=http://localhost:3000

SPOTIFY_CLIENT_ID=<your_spotify_client_id>
SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret>
SPOTIFY_REDIRECT_URI=http://localhost:5000/spotify/callback
SPOTIFY_AUTH_URL=https://accounts.spotify.com/authorize
SPOTIFY_TOKEN_URL=https://accounts.spotify.com/api/token

GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:5000/google/callback
GOOGLE_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
GOOGLE_TOKEN_URL=https://accounts.google.com/o/oauth2/token
```

<br />

Install dependencies:

```
cd client
npm install

cd ..
cd /server
npm install
```

<br />

To start the application, inside `/server` folder run:

```
npm run dev
```

This script concurrently starts both client side and server side.

You can access the app in your web browser at http://127.0.0.1:3000/

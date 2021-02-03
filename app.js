const express = require('express');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

// create a playlist
async function createPlaylist() {

    try {

        let requestBody = {
            "name": "YT Likes",
            "description": "Youtube Playlist",
            "public": false
        };

        let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists`

        let req = await axios.post(query, requestBody, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.USER_TOKEN}`
            }
        });

        return req;
        // const { status, statusText, config: { url, data }, data: { id, description, href, name } } = req;

    } catch (err) {
        console.log(err);
    }

}

// createPlaylist();

// get a list of the playlists owned or followed by the current Spotify user.
async function listCurrentUsersPlaylists() {
    try {

        let query = `https://api.spotify.com/v1/me/playlists?limit=50&offset=0`;

        let req = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.USER_TOKEN}`
            }
        })

        const playlistNames = await req.data.items.map(item => {
            console.log(item.name);
        })

        // console.log(req.data.items);

    } catch (err) {
        console.log(err);
    }
};

listCurrentUsersPlaylists();

app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
});
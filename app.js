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

        let query = `https://api.spotify.com/v1/users/${process.env.SPOTIFY_ID}/playlists`

        let req = await axios.post(query, requestBody, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.SPOTIFY_SECRET}`
            }
        });

        let data = await req.json();

        return data["id"];
    } catch (err) {
        console.log(err);
    }

}

createPlaylist();

app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
});
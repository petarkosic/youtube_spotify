const express = require('express');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

const inquirer = require('inquirer');

let question = [
    {
        type: 'input',
        name: 'username',
        message: 'Your youtube username: '
    },
    // {
    //     type: 'input',
    //     name: 'youtubePlaylistName',
    //     message: 'Youtube playlist name: '
    // },
    // {
    //     type: 'input',
    //     name: 'spotifyPlaylistName',
    //     message: 'Spotify playlist name: '
    // },
];

inquirer.prompt(question)
    .then(answer => {
        let { username, youtubePlaylistName, spotifyPlaylistName } = answer;

        callApi(username);

        // console.log(username);
        // console.log(youtubePlaylistName);
        // console.log(spotifyPlaylistName);
    })

// let url = 'https://developers.google.com/apis-explorer/#p/youtube/v3/youtube.playlists.list?part=snippet,contentDetails&channelId=UClTyvJkG7idnsaTY5QeV4Ew';

// async function playlists() {

//     let req = await axios.get(url, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.USER_TOKEN}`
//         }
//     });

//     console.log(req);
// };
// playlists();

// const google = require('googleapis');
// const auth = google.auth.OAuth2;

// const client = new auth();

// const youtube = google.youtube({
//     version: 'v3',
//     auth: process.env.YOUTUBE_KEY
// });


// let url = youtube.playlists.list({ part: ['snippet', 'contentDetails'], channelId: 'UClTyvJkG7idnsaTY5QeV4Ew' });

// console.log(url.then(console.log));

async function callApi(username) {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet,contentDetails&forUsername=${username}`);

    // console.log(res.data.items[0].id);
    let id = res?.data?.items[0]?.id;
    getChannelPlaylists(id);

}

async function getChannelPlaylists(id) {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet&channelId=${id}`)

    console.log(res.data.items);
}

// const YOUTUBE_PLAYLIST_ITEMS_API = 'https://www.googleapis.com/youtube/v3/playlistItems';


// async function callApi() {
//     const res = await axios.get(`${ YOUTUBE_PLAYLIST_ITEMS_API }?part = snippet & maxResults=50 & playlistId=PL8kBmqk1msBzPRolbW6PHWITeguk2rQDU & key=${ process.env.YOUTUBE_KEY } `)

//     // console.log(res.data.items[0].snippet.title);

//     res.data.items.forEach(item => {
//         console.log(item.snippet.title);
//     })

// }
// callApi();

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

// listCurrentUsersPlaylists();

app.listen(PORT, (req, res) => {
    console.log(`Server listening on port ${PORT}`);
});
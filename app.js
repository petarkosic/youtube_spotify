const express = require('express');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

const inquirer = require('inquirer');
const getArtistTitle = require('get-artist-title');

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
        let { username } = answer;

        callApi(username);
    })

async function callApi(username) {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet,contentDetails&forUsername=${username}`);

    let id = res?.data?.items[0]?.id;
    getChannelPlaylists(id);

}

async function getChannelPlaylists(id) {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet&channelId=${id}`)

    let namesAndIds = {};

    const playlistNames = res.data.items.map(item => {
        return item.snippet.title;
    });

    const playlistNamesAndIds = res.data.items.map(item => {
        return namesAndIds[item.snippet.title] = item.id;
    });

    const playlistIds = res.data.items.map(item => {
        return item.id;
    });

    let question = [
        {
            type: 'input',
            name: 'youtubePlaylistName',
            message: 'Youtube playlist name (case sensitive): '
        },
    ];

    inquirer.prompt(question)
        .then(answer => {
            checkPlaylistName(playlistNames, answer, namesAndIds);
        })
        .catch(err => {
            console.log(err);
        })

}

// check if playlist already exists
function checkPlaylistName(playlistNames, userInput, namesAndIds) {

    const { youtubePlaylistName } = userInput;

    if (!playlistNames.includes(youtubePlaylistName)) {
        console.log('There is no playlist with that name.');
        console.log('Exiting...');
        process.exit(0);

    } else {
        playlistItems(youtubePlaylistName, namesAndIds);
        console.log('Success.');
    }
};

async function playlistItems(youtubePlaylistName, namesAndIds) {
    const playlistId = namesAndIds[youtubePlaylistName].toString();
    // console.log(playlistId);

    const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_KEY}`);


    // VIDEO TITLE
    res.data.items.forEach(item => {
        let [artist, title] = getArtistTitle(item.snippet.title);
        console.log(artist);
        // console.log(title);

        console.log(removeFromTitle(title));

        // extract artist name and song name
        // call spotify tracks api
    })

    // VIDEO ID
    // res.data.items.forEach(item => {
    //     console.log(item.snippet.resourceId.videoId);
    // });

}

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


function removeFromTitle(title) {
    return title
        .replace(/\|/, '') // escape pipe symbol
        .replace(/\(original mix\)/i, '') // original mix
        .replace(/\s*\(?(of+icial\s*)?audio\)?/i, '') // official audio
        .replace(/\(house\)/i, '') // (house)
        .replace(/\s*[a-z]*\s*\brecords$/i, ''); // (some word) records
}
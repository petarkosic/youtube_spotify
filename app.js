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

    let question = [
        {
            type: 'input',
            name: 'spotifyPlaylistName',
            message: 'Spotify playlist name: '
        },
    ];

    inquirer.prompt(question)
        .then(async answer => {
            const { spotifyPlaylistName } = answer;
            checkSpotifyPlaylistName(spotifyPlaylistName);
            await createPlaylist(spotifyPlaylistName);
        })
        .catch(err => {
            console.log(err);
        })

    // VIDEO TITLE
    res.data.items.forEach(item => {
        let [artist, title] = getArtistTitle(item.snippet.title);

        const songTitle = removeFromTitle(title);

        getSpotifySong(artist.trim(), songTitle.trim());

    })

    // VIDEO ID
    // res.data.items.forEach(item => {
    //     console.log(item.snippet.resourceId.videoId);
    // });

}

// check if playlist already exists
async function checkSpotifyPlaylistName(spotifyPlaylistName) {
    let currentPlaylists = await listCurrentUsersPlaylists();

    // let playlistId;

    if (currentPlaylists.includes(spotifyPlaylistName)) {
        console.log('Playlist with that name already exists.');
        console.log('Exiting...');
        process.exit(0);
    } else {
        // playlistId = await createPlaylist(spotifyPlaylistName);
        console.log(`Spotify playlist ${spotifyPlaylistName} created.`);
    }

    // return playlistId;

};

// get spotify song
async function getSpotifySong(artist, songTitle) {
    // call the tracks api
    try {

        let query = `https://api.spotify.com/v1/search?q=${songTitle}&artist=${artist}&type=track&offset=0&limit=20`;

        let req = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.USER_TOKEN}`
            }
        });


        return req.data.tracks.items[0].uri;

    } catch (err) {
        console.log(err);
    }
};


// create a playlist
async function createPlaylist(spotifyPlaylistName) {

    try {

        let requestBody = {
            "name": `${spotifyPlaylistName}`,
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

        return req.data.id;

    } catch (err) {
        console.log(err);
    }

}

// get a list of the playlists owned or followed by the current Spotify user.
async function listCurrentUsersPlaylists() {
    try {

        let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists?limit=50&offset=0`;

        let req = await axios.get(query, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.USER_TOKEN}`
            }
        })

        const playlistNames = await req.data.items.map(item => {
            // console.log(item.name);
            return item.name;
        })

        return playlistNames;
        // console.log(req.data.items);

    } catch (err) {
        console.log(err);
    }
};

// add song to playlist
async function addSongToPlaylist(playlistId, songsToAdd = getSpotifySong()) {
    // add songs from a youtube playlist to spotify playlist with a given id
};


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
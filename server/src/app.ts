// const express = require('express');
// const axios = require('axios');
// require('dotenv').config();
// const PORT = process.env.PORT || 5000;
// const app = express();

// // const inquirer = require('inquirer');
// // const getArtistTitle = require('get-artist-title');

// let question = [
//     {
//         type: 'input',
//         name: 'username',
//         message: 'Your youtube username: '
//     },
// ];

// inquirer.prompt(question)
//     .then(answer => {
//         let { username } = answer;

//         callApi(username);
//     })

// async function callApi(username) {
//     const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet,contentDetails&forUsername=${username}`);

//     let id = res?.data?.items[0]?.id;
//     getChannelPlaylists(id);

// }

// async function getChannelPlaylists(id) {
//     const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlists?access_token=${process.env.GOOGLE_ACCESS_TOKEN}&part=snippet&channelId=${id}`)

//     let namesAndIds = {};

//     const playlistNames = res.data.items.map(item => {
//         return item.snippet.title;
//     });

//     const playlistNamesAndIds = res.data.items.map(item => {
//         return namesAndIds[item.snippet.title] = item.id;
//     });

//     const playlistIds = res.data.items.map(item => {
//         return item.id;
//     });

//     let question = [
//         {
//             type: 'input',
//             name: 'youtubePlaylistName',
//             message: 'Youtube playlist name (case sensitive): '
//         },
//     ];

//     inquirer.prompt(question)
//         .then(answer => {
//             checkPlaylistName(playlistNames, answer, namesAndIds);
//         })
//         .catch(err => {
//             console.log(err);
//         })

// }

// // check if playlist already exists
// function checkPlaylistName(playlistNames, userInput, namesAndIds) {

//     const { youtubePlaylistName } = userInput;

//     if (!playlistNames.includes(youtubePlaylistName)) {
//         console.log('There is no playlist with that name.');
//         console.log('Exiting...');
//         process.exit(0);

//     } else {
//         playlistItems(youtubePlaylistName, namesAndIds);
//         console.log('Success.');
//     }
// };

// async function playlistItems(youtubePlaylistName, namesAndIds) {
//     const playlistId = namesAndIds[youtubePlaylistName].toString();
//     // console.log(playlistId);

//     const res = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE_KEY}`);

//     const playlist = await createPlaylist();
//     // let playlist = 'some playlist';

//     // VIDEO TITLE
//     res.data.items.forEach(async item => {
//         let [artist, title] = getArtistTitle(item.snippet.title);

//         const songTitle = removeFromTitle(title);

//         // await createPlaylist();

//         const songs = await getSpotifySong(artist, songTitle);

//         await addSongToPlaylist(playlist, songs)
//     })

//     // let question = [
//     //     {
//     //         type: 'input',
//     //         name: 'spotifyPlaylistName',
//     //         message: 'Spotify playlist name: '
//     //     },
//     // ];

//     // inquirer.prompt(question)
//     //     .then(async answer => {
//     //         const { spotifyPlaylistName } = answer;
//     //         await checkSpotifyPlaylistName(spotifyPlaylistName);
//     //     })

//     // let spotifyPlaylistId;

//     // inquirer.prompt(question)
//     //     .then(async answer => {
//     //         const { spotifyPlaylistName } = answer;
//     //         spotifyPlaylistId = await checkSpotifyPlaylistName(spotifyPlaylistName);
//     //         // await createPlaylist(spotifyPlaylistName);
//     //         // const titles = songTitles;
//     //         return spotifyPlaylistId
//     //         // await addSongToPlaylist(spotifyPlaylistId, songHref);
//     //     })
//     //     .catch(err => {
//     //         console.log(err);
//     //     })

//     // await addSongToPlaylist(spotifyPlaylistName, songTitles);

//     // VIDEO ID
//     // res.data.items.forEach(item => {
//     //     console.log(item.snippet.resourceId.videoId);
//     // });

// }

// // check if playlist already exists
// async function checkSpotifyPlaylistName(spotifyPlaylistName) {
//     let currentPlaylists = await listCurrentUsersPlaylists();

//     // let playlistId;

//     if (currentPlaylists.includes(spotifyPlaylistName)) {
//         console.log('Playlist with that name already exists.');
//         console.log('Exiting...');
//         process.exit(0);
//     } else {
//         // playlistId = await createPlaylist(spotifyPlaylistName);
//         console.log(`Spotify playlist ${spotifyPlaylistName} created.`);
//     }
//     // return spotifyPlaylistName

// };

// // get spotify song
// async function getSpotifySong(artist, songTitle) {
//     // call the tracks api
//     try {
//         let query = `https://api.spotify.com/v1/search?q=${songTitle}&artist=${artist}&type=track&offset=0&limit=20`;

//         let req = await axios.get(query, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.USER_TOKEN}`
//             }
//         });

//         return Array.from(req.data.tracks.items[0].uri).join('');

//     } catch (err) {
//         console.log(err);
//     }
// };

// // create a playlist
// async function createPlaylist() {

//     try {

//         let requestBody = {
//             "name": 'Youtube Playlist',
//             "description": "Youtube Playlist",
//             "public": false
//         };

//         // let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists`
//         let query = 'https://api.spotify.com/v1/me/playlists';

//         let req = await axios.post(query, requestBody, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.USER_TOKEN}`
//             }
//         });

//         return req.data.id;

//     } catch (err) {
//         console.log(err);
//     }

// }

// // get a list of the playlists owned or followed by the current Spotify user.
// async function listCurrentUsersPlaylists() {
//     try {

//         // let query = `https://api.spotify.com/v1/users/${process.env.USER_ID}/playlists?limit=50&offset=0`;
//         let query = `https://api.spotify.com/v1/me/playlists?limit=50&offset=0`;

//         let req = await axios.get(query, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.USER_TOKEN}`
//             }
//         })

//         const playlistNames = await req.data.items.map(item => {
//             // console.log(item.name);
//             return item.name;
//         })

//         return playlistNames;
//         // console.log(req.data.items);

//     } catch (err) {
//         console.log(err);
//     }
// };

// // add song to playlist
// async function addSongToPlaylist(playlistId, songsToAdd) {

//     try {
//         // add songs from a youtube playlist to spotify playlist with a given id
//         // let uris = await songsToAdd

//         // console.log(uris);
//         let query = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${songsToAdd}`;
//         // let query = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

//         // console.log(query);

//         let req = await axios.post(query, songsToAdd, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.USER_TOKEN}`
//             }
//         });

//         return req;

//     } catch (err) {
//         console.log(err)
//     }
// };

// app.listen(PORT, (req, res) => {
//     console.log(`Server listening on port ${PORT}`);
// });

// function removeFromTitle(title) {
//     return title
//         .replace(/\|/, '') // escape pipe symbol
//         .replace(/\(original mix\)/i, '') // original mix
//         .replace(/\s*\(?(of+icial\s*)?audio\)?/i, '') // official audio
//         .replace(/\(house\)/i, '') // (house)
//         .replace(/\s*[a-z]*\s*\brecords$/i, ''); // (some word) records
// }

// SPOTIFY WEB API AUTHORIZATION CODE FLOW
// https://developer.spotify.com/documentation/general/guides/authorization-guide/
// https://github.com/spotify/web-api-auth-examples

import { config } from 'dotenv';
config();

let FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

import express from 'express';
import cors from 'cors';
import spotifyAuthRoutes from './routes/spotifyAuthRoutes';
import googleAuthRoutes from './routes/googleAuthRoutes';

const app = express();

app.use(express.json());

const corsOptions = {
	origin: FRONTEND_URI,
};

app.use(cors(corsOptions));

app.get('/', function (req: any, res: any) {
	res.json({ message: 'hello' });
});

app.use('/spotify', spotifyAuthRoutes);
app.use('/google', googleAuthRoutes);

app.listen(PORT, function () {
	console.warn(`Listening on port ${PORT}`);
});

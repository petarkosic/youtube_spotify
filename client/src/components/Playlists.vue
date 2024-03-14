<template>
	<div class="spotify-playlists">
		<h2>Your Playlists</h2>
		<p v-if="searchedSongs !== 0">
			{{ searchedSongs }} / {{ playlistItems.length }} songs searched
		</p>

		<div class="playlists">
			<ul>
				<li v-for="playlist in playlists" :key="playlist.id">
					{{ playlist.name }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import pMap from 'p-map';

const props = defineProps({
	accessToken: {
		type: String,
		required: true,
	},
});

interface Playlist {
	id: string;
	name: string;
}

interface Song {
	artist: string;
	songTitle: string;
}

const playlists = ref<Playlist[]>([]);
const playlistTitle = ref(localStorage.getItem('selectedPlaylist'));
const playlistItems = ref(JSON.parse(localStorage.getItem('playlistItems')!));
const searchedSongs = ref(0);

const playlistAlreadyExists = (playlists: Playlist[]) => {
	const pl = playlists.find(
		(playlist) => playlist.name === playlistTitle.value
	);

	return !!pl;
};

const getPlaylists = async () => {
	try {
		const response = await axios.get(
			'https://api.spotify.com/v1/me/playlists',
			{
				headers: {
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		for (let pl of response.data.items) {
			playlists.value.push({ id: pl.id, name: pl.name });
		}

		if (!playlistAlreadyExists(playlists.value)) {
			let spotifySongsUrls: (string | undefined)[] = [];

			await pMap(
				playlistItems.value.reverse(),
				async (song: Song) => {
					const { artist, songTitle } = song;
					if (artist === '' || songTitle === '') {
						return;
					}

					const spotifySong = await getSpotifySong(artist, songTitle);
					spotifySongsUrls.push(spotifySong);
					searchedSongs.value++;
				},
				{ concurrency: 100 }
			);

			const playlistId = await createPlaylist();

			// divide songs into groups of 100
			const maxSongsPerRequest = 100;
			const numOfRequests = Math.ceil(
				spotifySongsUrls.length / maxSongsPerRequest
			);

			for (let i = 0; i < numOfRequests; i++) {
				const start = i * maxSongsPerRequest;
				const end = (i + 1) * maxSongsPerRequest;
				const songsToAdd = spotifySongsUrls.slice(start, end);
				const songsToAddString = songsToAdd.join(',');

				await addSongToPlaylist(playlistId, songsToAddString);
			}

			window.location.reload();
		}
	} catch (error: any) {
		console.error('Error fetching playlists:', error);
	}
};

const createPlaylist = async () => {
	try {
		const response = await axios.post(
			'https://api.spotify.com/v1/me/playlists',
			{
				name: playlistTitle.value,
			},
			{
				headers: {
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		return response.data.id;
	} catch (error) {
		console.error('Error creating playlist:', error);
	}
};

// get spotify song
async function getSpotifySong(artist: string, songTitle: string) {
	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(
				`${artist} ${songTitle}`
			)}&artist=${encodeURIComponent(artist)}&type=track&offset=0&limit=10`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		return Array.from(response.data.tracks.items[0].uri).join('');
	} catch (err) {
		console.log(err);
	}
}

// add song to playlist
async function addSongToPlaylist(playlistId: string, songsToAdd: string) {
	try {
		const response = await axios.post(
			`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${songsToAdd}`,
			songsToAdd,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		return response;
	} catch (err) {
		console.log(err);
	}
}

onMounted(() => {
	getPlaylists();
});
</script>

<style scoped>
.spotify-playlists {
	width: 80%;
	display: flex;
	flex-direction: column;
}

.playlist {
	padding: 2rem;
}

ul {
	list-style-type: none;
	padding: 0;
	width: 100%;
	height: 70%;
	overflow: auto;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

li {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 1rem;
}
</style>

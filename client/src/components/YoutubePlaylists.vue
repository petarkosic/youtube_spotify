<template>
	<div>
		<div v-if="loading">Loading playlist items</div>
		<div v-if="!loading && playlistItems.length">
			Playlist items loaded: {{ playlistItems.length }} items
		</div>

		<ul>
			<li
				v-for="playlist in playlists"
				:key="playlist.id"
				@click="selectPlaylist(playlist.id)"
			>
				<div>{{ playlist.snippet.title }}</div>
				<button
					v-if="selectedPlaylist === playlist.id"
					@click="getPlaylistItems(playlist.id)"
				>
					&gt;
				</button>
			</li>
		</ul>
	</div>

	<div v-if="playlistItems.length !== 0">
		<button @click="showSpotifyComponent">Login to Spotify</button>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const showSpotifyComponent = () => {
	localStorage.setItem('showSpotifyLogin', 'true');
	window.location.reload();
};

const props = defineProps({
	accessToken: {
		type: String,
		required: true,
	},
});

interface Playlist {
	etag: string;
	id: string;
	kind: string;
	snippet: {
		channelId: string;
		channelTitle: string;
		description: string;
		publishedAt: string;
		title: string;
		localized: {
			description: string;
			title: string;
		};
		thumbnails: {
			default: {
				url: string;
				width: number;
				height: number;
			};
			high: {
				url: string;
				width: number;
				height: number;
			};
			maxres: {
				url: string;
				width: number;
				height: number;
			};
			medium: {
				url: string;
				width: number;
				height: number;
			};
			standard: {
				url: string;
				width: number;
				height: number;
			};
		};
	};
}

const playlists = ref<Playlist[]>([]);
const selectedPlaylist = ref('');
const playlistItems = ref<any[]>([]);
const loading = ref<boolean>(false);

const getChannel = async () => {
	try {
		const response = await axios.get(
			'https://www.googleapis.com/youtube/v3/channels',
			{
				params: {
					part: 'snippet,contentDetails',
					mine: true,
				},
				headers: {
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		let id = response.data?.items[0]?.id;

		await getPlaylists(id);
	} catch (error) {
		console.error('Error fetching channel:', error);
	}
};

const getPlaylists = async (channelId: number) => {
	try {
		const response = await axios.get(
			'https://www.googleapis.com/youtube/v3/playlists',
			{
				params: {
					part: 'snippet',
					channelId: channelId,
				},
				headers: {
					Authorization: `Bearer ${props.accessToken}`,
				},
			}
		);

		playlists.value = response.data.items;
	} catch (error) {
		console.error('Error fetching playlists:', error);
	}
};

const selectPlaylist = (playlistId: string) => {
	selectedPlaylist.value = playlistId;
};

const getPlaylistItems = async (playlistId: string) => {
	try {
		loading.value = true;
		let nextPageToken = '';
		const allItems = [];

		do {
			const response = await axios.get(
				'https://www.googleapis.com/youtube/v3/playlistItems',
				{
					params: {
						part: 'snippet',
						playlistId: playlistId,
						maxResults: 50,
						pageToken: nextPageToken,
					},
					headers: {
						Authorization: `Bearer ${props.accessToken}`,
					},
				}
			);

			if (response.status === 200) {
				const items = response.data.items
					.map((item: any) => item.snippet.title)
					.filter(
						(item: any) =>
							item.toLowerCase() !== 'private video' &&
							item.toLowerCase() !== 'deleted video'
					);

				allItems.push(...items);
				nextPageToken = response.data.nextPageToken;
			} else {
				throw new Error('Failed to get playlist items');
			}
		} while (nextPageToken);

		playlistItems.value = allItems;
	} catch (error) {
		console.error('Error checking items:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	getChannel();
});
</script>

<style scoped></style>

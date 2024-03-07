<template>
	<div>
		<ul>
			<li v-for="playlist in playlists" :key="playlist.id">
				<div>{{ playlist.snippet.title }}</div>
			</li>
		</ul>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

		playlists.value = response.data.items!;
	} catch (error) {
		console.error('Error fetching playlists:', error);
	}
};

onMounted(() => {
	getChannel();
});
</script>

<style scoped></style>

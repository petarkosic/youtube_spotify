<template>
	<div>
		<h2>Your Playlists</h2>
		<ul>
			<li v-for="playlist in playlists" :key="playlist.id">
				{{ playlist.name }}
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
	id: string;
	name: string;
}

const playlists = ref<Playlist[]>([]);

const fetchPlaylists = async () => {
	try {
		const response = await axios.get(
			'https://api.spotify.com/v1/me/playlists',
			{
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

onMounted(() => {
	fetchPlaylists();
});
</script>

<style scoped></style>

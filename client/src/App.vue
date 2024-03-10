<template>
	<div class="container">
		<Intro />
		<Google v-if="!showSpotifyLogin" />
		<Spotify v-if="showSpotifyLogin" />
	</div>
</template>

<script lang="ts" setup>
import Intro from './components/Intro.vue';
import Google from './components/Google.vue';
import Spotify from './components/Spotify.vue';
import { ref } from 'vue';

const showSpotifyLogin = ref<boolean>(
	Boolean(localStorage.getItem('showSpotifyLogin')) || false
);
</script>

<style scoped>
.container {
	background: #333;
	width: 1000px;
	height: 400px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 2rem;
	margin: 0;
	padding: 1rem;
	border-radius: 8px;
}
</style>

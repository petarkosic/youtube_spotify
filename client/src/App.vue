<template>
	<div class="container">
		<Intro />
		<Google />
		<!-- <div class="card" v-if="token">
			<Spotify />
		</div> -->
	</div>
</template>

<script lang="ts" setup>
import Intro from './components/Intro.vue';
import Google from './components/Google.vue';
// import Spotify from './components/Spotify.vue';
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

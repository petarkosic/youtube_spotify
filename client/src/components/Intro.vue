<template>
	<div class="wrapper">
		<div class="title">
			<h1>Youtube to Spotify Converter</h1>
			<p>Convert your favorite YouTube playlists to Spotify effortlessly.</p>
		</div>
		<div class="instructions">
			<p>Pick a playlist to convert.</p>
			<p>Get the songs.</p>
			<p>Convert!</p>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped>
.wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-evenly;
	gap: 4rem;
	text-align: left;
	padding: 0 2rem;
}

h1,
p {
	margin: 0;
}

h1 {
	font-size: 2rem;
	margin-bottom: 1rem;
}

@media screen and (max-width: 768px) {
	.wrapper {
		height: 300px;
	}
}
</style>

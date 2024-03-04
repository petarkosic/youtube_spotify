<template>
	<div>
		<button v-if="accessToken" @click="logout">Logout</button>
		<playlists v-if="accessToken" :accessToken="accessToken" />
		<button v-else @click="login">Login with Spotify</button>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Playlists from './components/Playlists.vue';

const accessToken = ref<string>(
	localStorage.getItem('spotify_access_token') || ''
);

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const refreshToken = async () => {
	let refreshTokenFromStorage = localStorage.getItem('spotify_refresh_token');

	if (!refreshTokenFromStorage) {
		console.error('No refresh token found in local storage');
		return;
	}

	try {
		const response = await axios.get(
			`http://localhost:5000/spotify/refresh_token?refresh_token=${refreshTokenFromStorage}`
		);
		const { access_token } = response.data;

		accessToken.value = access_token;

		localStorage.setItem('spotify_access_token', access_token);
	} catch (error) {
		console.error('Error refreshing token:', error);
	}
};

const checkTokenExpiration = () => {
	const tokenExpirationTime = Number(
		localStorage.getItem('spotify_token_expiration_time')
	);

	if (Date.now() - tokenExpirationTime > EXPIRATION_TIME) {
		console.log('Token has expired, refreshing...');
		refreshToken();
	}
};

onMounted(() => {
	const intervalId = setInterval(checkTokenExpiration, 60 * 60 * 1000);

	return () => {
		clearInterval(intervalId);
	};
});

const login = async () => {
	try {
		const response = await axios.get('http://localhost:5000/spotify/login');
		window.location.href = response.data.redirect_url; // Redirect to Spotify authorization page
	} catch (error) {
		console.error('Error during login:', error);
	}
};

const handleCallback = () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const access_token = urlParams.get('access_token');
		const refresh_token = urlParams.get('refresh_token');

		if (access_token && refresh_token) {
			accessToken.value = access_token;
			localStorage.setItem('spotify_access_token', access_token);
			localStorage.setItem('spotify_refresh_token', refresh_token);
			localStorage.setItem('spotify_token_expiration_time', String(Date.now()));
		}

		window.history.pushState('', '', '/'); // Clear the URL
	} catch (error) {
		console.error('Error during callback:', error);
	}
};

onMounted(() => {
	handleCallback();
});

const logout = () => {
	localStorage.removeItem('spotify_access_token');
	localStorage.removeItem('spotify_refresh_token');
	localStorage.removeItem('spotify_token_expiration_time');
	accessToken.value = '';
};
</script>

<style scoped></style>

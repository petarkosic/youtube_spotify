<template>
	<div class="card card-spotify">
		<button v-if="accessToken" @click="logout">Logout</button>
		<Playlists v-if="accessToken" :accessToken="accessToken" />
		<button v-else @click="login">Login to Spotify</button>
		<div v-if="authCancelledError" style="color: red">
			{{ authCancelledError }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Playlists from './Playlists.vue';

const accessToken = ref<string>(
	localStorage.getItem('spotify_access_token') || ''
);

const authCancelledError = ref<string>('');

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
		localStorage.setItem('spotify_token_expiration_time', String(Date.now()));
	} catch (error) {
		console.error('Error refreshing token:', error);
	}
};

const checkTokenExpiration = () => {
	const tokenExpirationTime = Number(
		localStorage.getItem('spotify_token_expiration_time')
	);

	if (
		tokenExpirationTime &&
		Date.now() - tokenExpirationTime > EXPIRATION_TIME
	) {
		console.log('Token has expired, refreshing...');
		refreshToken();
	}
};

onMounted(() => {
	checkTokenExpiration();
	const intervalId = setInterval(checkTokenExpiration, 60 * 60 * 1000);

	return () => {
		clearInterval(intervalId);
	};
});

const login = async () => {
	try {
		const response = await axios.get('http://localhost:5000/spotify/login');

		window.location.href = response.data.redirect_url;
	} catch (error) {
		console.error('Error during login:', error);
	}
};

const handleCallback = async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const access_token = urlParams.get('spotify_access_token');
		const refresh_token = urlParams.get('spotify_refresh_token');

		if (access_token && refresh_token) {
			accessToken.value = access_token;
			localStorage.setItem('spotify_access_token', access_token);
			localStorage.setItem('spotify_refresh_token', refresh_token);
			localStorage.setItem('spotify_token_expiration_time', String(Date.now()));
		} else if (urlParams.get('error') === 'access_denied') {
			authCancelledError.value = 'User cancelled authorization';
			setTimeout(() => {
				authCancelledError.value = '';
			}, 5000);
		}

		window.history.pushState('', '', '/'); // Clear the URL
	} catch (error) {
		console.error('Error during callback:', error);
	}
};

const logout = () => {
	localStorage.removeItem('spotify_access_token');
	localStorage.removeItem('spotify_refresh_token');
	localStorage.removeItem('spotify_token_expiration_time');
	window.location.reload();
	accessToken.value = '';
};

onMounted(() => {
	handleCallback();
});
</script>

<style scoped>
.card-spotify {
	background: #1ed661;
}
</style>

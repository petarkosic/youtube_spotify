<template>
	<div class="card card-google">
		<button class="logout-button" v-if="accessToken" @click="logout">
			Logout
		</button>
		<YoutubePlaylists v-if="accessToken" :accessToken="accessToken" />
		<button v-else @click="login">Login to Google</button>
		<div v-if="authCancelledError" style="color: red">
			{{ authCancelledError }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import YoutubePlaylists from './YoutubePlaylists.vue';

const accessToken = ref<string>(
	localStorage.getItem('google_access_token') || ''
);

const authCancelledError = ref<string>('');

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const refreshToken = async () => {
	let refreshTokenFromStorage = localStorage.getItem('google_refresh_token');

	if (!refreshTokenFromStorage) {
		console.error('No refresh token found in local storage');
		return;
	}

	try {
		const response = await axios.get(
			`http://localhost:5000/google/refresh_token?refresh_token=${refreshTokenFromStorage}`
		);

		const { access_token } = response.data;

		accessToken.value = access_token;
		localStorage.setItem('google_access_token', access_token);
		localStorage.setItem('google_token_expiration_time', String(Date.now()));
	} catch (error) {
		console.error('Error refreshing token:', error);
	}
};

const checkTokenExpiration = () => {
	const tokenExpirationTime = Number(
		localStorage.getItem('google_token_expiration_time')
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
	const response = await axios.get('http://localhost:5000/google/login');

	window.location.href = response.data.redirect_url;
};

const handleCallback = async () => {
	try {
		const urlParams = new URLSearchParams(window.location.search);
		const access_token = urlParams.get('google_access_token');
		const refresh_token = urlParams.get('google_refresh_token');

		if (access_token && refresh_token) {
			accessToken.value = access_token;
			localStorage.setItem('google_access_token', access_token);
			localStorage.setItem('google_refresh_token', refresh_token);
			localStorage.setItem('google_token_expiration_time', String(Date.now()));
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
	localStorage.removeItem('google_access_token');
	localStorage.removeItem('google_refresh_token');
	localStorage.removeItem('google_token_expiration_time');
	accessToken.value = '';
};

onMounted(() => {
	handleCallback();
});
</script>

<style scoped>
.card-google {
	background: #fe0001;
}
</style>

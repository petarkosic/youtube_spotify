<template>
	<div>
		<button @click="login">Login with Spotify</button>
	</div>
</template>

<script lang="ts" setup>
import axios from 'axios';

const login = async () => {
	try {
		const response = await axios.get('http://localhost:5000/login');
		console.log('Login successful:', response.data);
		// Handle response, e.g., redirect to Spotify authorization URL
	} catch (error) {
		console.error('Error during login:', error);
		// Handle error, e.g., display error message to user
	}
};
</script>

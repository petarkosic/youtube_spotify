import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		watch: {
			usePolling: true,
		},
		port: 3000,
		strictPort: true,
		cors: true,
	},
});

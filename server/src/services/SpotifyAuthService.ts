import axios from 'axios';
import qs from 'qs';

export class SpotifyAuthService {
	SPOTIFY_CLIENT_ID: string;
	SPOTIFY_CLIENT_SECRET: string;
	REDIRECT_URI: string;
	FRONTEND_URI: string;
	SPOTIFY_AUTH_URL: string;
	SPOTIFY_TOKEN_URL: string;

	constructor() {
		this.SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
		this.SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
		this.REDIRECT_URI =
			process.env.REDIRECT_URI || 'http://localhost:5000/callback';
		this.FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
		this.SPOTIFY_AUTH_URL = process.env.SPOTIFY_AUTH_URL || '';
		this.SPOTIFY_TOKEN_URL = process.env.SPOTIFY_TOKEN_URL || '';
	}

	generateRandomString(length: any): string {
		let text = '';
		const possible =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	async login(): Promise<string> {
		const state = this.generateRandomString(16);

		const scope =
			'playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative user-read-email user-read-private';

		const params = {
			client_id: this.SPOTIFY_CLIENT_ID,
			response_type: 'code',
			redirect_uri: this.REDIRECT_URI,
			scope: scope,
			state: state,
			show_dialog: 'true', // debug and testing purposes only
		};

		const auth_url = `${this.SPOTIFY_AUTH_URL}?` + qs.stringify(params);

		return auth_url;
	}

	async handleCallback(code: string): Promise<any> {
		try {
			const response = await axios.post(
				`${this.SPOTIFY_TOKEN_URL}`,
				qs.stringify({
					grant_type: 'authorization_code',
					code: code,
					redirect_uri: this.REDIRECT_URI,
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${Buffer.from(
							`${this.SPOTIFY_CLIENT_ID}:${this.SPOTIFY_CLIENT_SECRET}`
						).toString('base64')}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			throw new Error('Failed to get access token');
		}
	}

	async refreshAccessToken(refreshToken: string): Promise<any> {
		try {
			const response = await axios.post(
				`${this.SPOTIFY_TOKEN_URL}`,
				qs.stringify({
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						Authorization: `Basic ${Buffer.from(
							`${this.SPOTIFY_CLIENT_ID}:${this.SPOTIFY_CLIENT_SECRET}`
						).toString('base64')}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			throw new Error('Failed to refresh access token');
		}
	}
}

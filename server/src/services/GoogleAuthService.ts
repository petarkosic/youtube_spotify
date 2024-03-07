import axios from 'axios';
import qs from 'qs';

export class GoogleAuthService {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	FRONTEND_URI: string;
	GOOGLE_TOKEN_URL: string;
	GOOGLE_AUTH_URL: string;

	constructor() {
		this.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
		this.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
		this.GOOGLE_REDIRECT_URI =
			process.env.GOOGLE_REDIRECT_URI ||
			'http://localhost:5000/google/callback';
		this.FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
		this.GOOGLE_AUTH_URL = process.env.GOOGLE_AUTH_URL || '';
		this.GOOGLE_TOKEN_URL = process.env.GOOGLE_TOKEN_URL || '';
	}

	async login() {
		const scope = 'https://www.googleapis.com/auth/youtube.readonly';

		const params = {
			client_id: this.GOOGLE_CLIENT_ID,
			response_type: 'code',
			redirect_uri: this.GOOGLE_REDIRECT_URI,
			scope: scope,
			access_type: 'offline',
			prompt: 'consent',
		};

		const auth_url = `${this.GOOGLE_AUTH_URL}?` + qs.stringify(params);

		return auth_url;
	}

	async handleCallback(code: string) {
		try {
			const response = await axios.post(
				`${this.GOOGLE_TOKEN_URL}`,
				qs.stringify({
					code: code,
					client_id: this.GOOGLE_CLIENT_ID,
					client_secret: this.GOOGLE_CLIENT_SECRET,
					redirect_uri: this.GOOGLE_REDIRECT_URI,
					grant_type: 'authorization_code',
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);

			return response.data;
		} catch (error) {
			throw new Error('Failed to get access token');
		}
	}

	async refreshAccessToken(refreshToken: string) {
		const scope = 'https://www.googleapis.com/auth/youtube.readonly';

		try {
			const response = await axios.post(
				`${this.GOOGLE_TOKEN_URL}`,
				qs.stringify({
					access_type: 'offline',
					client_id: this.GOOGLE_CLIENT_ID,
					client_secret: this.GOOGLE_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
					scope: scope,
				})
			);

			return response.data;
		} catch (error) {
			throw new Error('Failed to refresh access token');
		}
	}
}

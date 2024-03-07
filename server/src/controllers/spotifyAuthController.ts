import { Request, Response } from 'express';
import { SpotifyAuthService } from '../services/SpotifyAuthService';

class SpotifyAuthController {
	private spotifyService: SpotifyAuthService;

	constructor() {
		this.spotifyService = new SpotifyAuthService();
	}

	handleLogin = async (req: Request, res: Response) => {
		try {
			const authUrl = await this.spotifyService.login();

			res.json({ redirect_url: authUrl });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Failed to initiate login process' });
		}
	};

	handleCallback = async (req: Request, res: Response) => {
		const code = req.query.code as string;

		if (!code) {
			if (req.query.error === 'access_denied') {
				return res
					.status(403)
					.redirect(`${this.spotifyService.FRONTEND_URI}/?error=access_denied`);
			} else {
				return res.status(400).json({ error: 'Authorization code not found' });
			}
		}

		try {
			const tokens = await this.spotifyService.handleCallback(code);

			res.redirect(
				`${this.spotifyService.FRONTEND_URI}?spotify_access_token=${tokens.access_token}&spotify_refresh_token=${tokens.refresh_token}`
			);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Failed to handle callback' });
		}
	};

	handleRefreshToken = async (req: Request, res: Response) => {
		const refreshToken = req.query.refresh_token as string;

		if (!refreshToken) {
			res.status(400).json({ error: 'Refresh token not found' });
			return;
		}

		try {
			const { access_token } = await this.spotifyService.refreshAccessToken(
				refreshToken
			);

			res.json({ access_token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Failed to refresh access token' });
		}
	};
}

export default new SpotifyAuthController();

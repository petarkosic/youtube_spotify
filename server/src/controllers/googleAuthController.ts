import { Request, Response } from 'express';
import { GoogleAuthService } from '../services/GoogleAuthService';

class GoogleAuthController {
	private googleService: GoogleAuthService;

	constructor() {
		this.googleService = new GoogleAuthService();
	}

	handleLogin = async (req: Request, res: Response) => {
		try {
			const authUrl = await this.googleService.login();

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
					.redirect(`${this.googleService.FRONTEND_URI}/?error=access_denied`);
			} else {
				return res.status(400).json({ error: 'Authorization code not found' });
			}
		}

		try {
			const tokens = await this.googleService.handleCallback(code);

			res.redirect(
				`${this.googleService.FRONTEND_URI}?google_access_token=${tokens.access_token}&google_refresh_token=${tokens.refresh_token}`
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
			const { access_token } = await this.googleService.refreshAccessToken(
				refreshToken
			);

			res.json({ access_token });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Failed to refresh access token' });
		}
	};
}

export default new GoogleAuthController();

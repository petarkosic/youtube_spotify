import { config } from 'dotenv';
config();

let FRONTEND_URI = process.env.FRONTEND_URI || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;

import express from 'express';
import cors from 'cors';
import spotifyAuthRoutes from './routes/spotifyAuthRoutes';
import googleAuthRoutes from './routes/googleAuthRoutes';

const app = express();

app.use(express.json());

const corsOptions = {
	origin: FRONTEND_URI,
};

app.use(cors(corsOptions));

app.get('/', function (req: any, res: any) {
	res.json({ message: 'hello' });
});

app.use('/spotify', spotifyAuthRoutes);
app.use('/google', googleAuthRoutes);

app.listen(PORT, function () {
	console.warn(`Listening on port ${PORT}`);
});
